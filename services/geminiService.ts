import { GoogleGenAI } from "@google/genai";
import { UserInput, PredictionResult, PropertyType, Source } from "../types";
import { BENCHMARK_RATES } from "../constants";
import { supabase } from './supabaseClient';
import { generateNRIMetrics } from '../utils/nriScoring';
import { parsePropertyMarkers } from '../utils/propertyParser';
// Fetch real sources using Serper API
const fetchRealSources = async (locality: string): Promise<Source[]> => {
  // Try standard Vite env var first, fallback to process.env for safety
  const serperApiKey = import.meta.env.VITE_SERPER_API_KEY || process.env.SERPER_API_KEY;
  if (!serperApiKey) {
    console.warn("Serper API Key is missing. Sources will not be available.");
    return [];
  }
  try {
    const query = `property for sale ${locality} Trivandrum Kerala India site:99acres.com OR site:magicbricks.com OR site:housing.com OR site:olx.in`;
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': serperApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: query, num: 10 })
    });
    if (!response.ok) {
      console.error('Serper API error:', response.statusText);
      return [];
    }
    const data = await response.json();
    const sources: Source[] = [];
    // Extract organic results
    if (data.organic && Array.isArray(data.organic)) {
      data.organic.forEach((result: any) => {
        if (result.link && result.title) {
          sources.push({ title: result.title, uri: result.link });
        }
      });
    }
    // Prioritize known real estate domains
    const PRIORITY_DOMAINS = ['99acres', 'magicbricks', 'housing.com', 'commonfloor', 'olx.in', 'keralarealestate', 'squareyards'];
    sources.sort((a, b) => {
      const aPriority = PRIORITY_DOMAINS.some(d => a.uri.includes(d)) ? 1 : 0;
      const bPriority = PRIORITY_DOMAINS.some(d => b.uri.includes(d)) ? 1 : 0;
      return bPriority - aPriority; // Higher priority first
    });
    return sources.slice(0, 10);
  } catch (error) {
    console.error('Error fetching sources from Serper:', error);
    return [];
  }
};
// Helper: Get cache duration based on baseline confidence
const getCacheDuration = (baseline: any): number => {
  if (!baseline) return 12 * 60 * 60 * 1000; // 12 hours default

  const { sample_size, variance, confidence_score } = baseline;

  // High confidence: 7 days (15+ searches, low variance, high confidence)
  if (sample_size >= 15 && variance <= 10 && confidence_score >= 85) {
    console.log(`🎯 HIGH confidence for locality - 7-day cache (${sample_size} searches, ${confidence_score}% confidence)`);
    return 7 * 24 * 60 * 60 * 1000;
  }

  // Medium confidence: 2 days (5-14 searches)
  if (sample_size >= 5 && sample_size < 15) {
    console.log(`📊 MEDIUM confidence for locality - 2-day cache (${sample_size} searches)`);
    return 2 * 24 * 60 * 60 * 1000;
  }

  // Low confidence: 12 hours (<5 searches)
  console.log(`⚠️ LOW confidence for locality - 12-hour cache (${sample_size} searches)`);
  return 12 * 60 * 60 * 1000;
};

// Helper: Check cache with tiered durations
const checkCache = async (locality: string): Promise<number | null> => {
  try {
    // Get baseline to determine cache duration
    const baseline = await getBaseline(locality);
    const cacheDuration = getCacheDuration(baseline);

    const { data } = await supabase
      .from('search_cache')
      .select('cached_rate, cached_at')
      .eq('locality', locality)
      .single();

    if (data) {
      const cacheAge = Date.now() - new Date(data.cached_at).getTime();
      const ageInHours = Math.round(cacheAge / (60 * 60 * 1000));
      const durationInDays = cacheDuration / (24 * 60 * 60 * 1000);

      if (cacheAge < cacheDuration) {
        console.log(`✅ Cache HIT for ${locality} - Age: ${ageInHours}hrs, Max: ${durationInDays}d`);
        return data.cached_rate;
      } else {
        console.log(`❌ Cache EXPIRED for ${locality} - Age: ${ageInHours}hrs exceeded ${durationInDays}d`);
      }
    } else {
      console.log(`🆕 No cache found for ${locality}`);
    }
    return null;
  } catch (error) {
    console.error('Cache check error:', error);
    return null;
  }
};
// Helper: Get baseline for locality
const getBaseline = async (locality: string) => {
  try {
    const { data } = await supabase
      .from('locality_baselines')
      .select('*')
      .eq('locality', locality)
      .single();
    return data;
  } catch {
    return null;
  }
};
// Helper: Store search result
const storeSearchResult = async (locality: string, landRate: number) => {
  try {
    await supabase.from('locality_search_history').insert({
      locality,
      land_rate: landRate,
      source_quality: 'medium'
    });
  } catch (err) {
    console.error('Error storing search result:', err);
  }
};
// Helper: Update cache
const updateCache = async (locality: string, landRate: number) => {
  try {
    await supabase.from('search_cache').upsert({
      locality,
      cached_rate: landRate,
      cached_at: new Date().toISOString()
    }, { onConflict: 'locality' });
  } catch (err) {
    console.error('Error updating cache:', err);
  }
};
// Helper: Calculate confidence
const calculateConfidence = (baseline: any, sampleSize: number, variance: number): any => {
  let score = 50; // Base score
  let level: 'Low' | 'Medium' | 'High' = 'Medium';
  // Sample size scoring
  if (sampleSize >= 15) score += 30;
  else if (sampleSize >= 5) score += 20;
  else if (sampleSize >= 3) score += 10;
  else score += 5; // Very small sample
  // Variance scoring (only if we have enough data for meaningful variance)
  if (sampleSize >= 3) {
    if (variance <= 10) score += 20; // <10% variance = excellent
    else if (variance <= 20) score += 10; // <20% = good
    else score -= 10; // >20% = concerning
  }
  // Cap score for small samples
  if (sampleSize < 5) {
    score = Math.min(score, 55); // Max 55% for <5 samples
  }
  // Determine level
  if (score >= 80) level = 'High';
  else if (score >= 60) level = 'Medium';
  else level = 'Low';
  return {
    score: Math.min(100, Math.max(0, score)),
    level,
    sampleSize,
    lastUpdated: baseline?.last_updated || 'Unknown'
  };
};
export const predictPrice = async (input: UserInput): Promise<PredictionResult> => {
  const locality = input.locality;
  let sources: Source[] = [];
  // Step 1: Check cache first (24hr)
  const cachedRate = await checkCache(locality);
  let medianLandRate = cachedRate;
  // Step 2: Get baseline for validation
  const baseline = await getBaseline(locality);

  // Fetch real sources (needed for property markers even if rate is cached)
  sources = await fetchRealSources(locality);

  // NEW: Parse property markers deterministically from sources
  const propertyMarkers = parsePropertyMarkers(sources);

  // Step 3: If no cache, fetch from AI
  let aiData: any = {};
  if (!cachedRate) {

    const apiKey = import.meta.env.VITE_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing. Please check your Netlify configuration.");
    }
    const ai = new GoogleGenAI({ apiKey });
    const isPlot = input.type === PropertyType.PLOT;
    // Construct features string
    let features = `Road Access: ${input.roadWidth}`;
    if (!isPlot) {
      features += `, Built Area: ${input.builtArea} sq ft, Bedrooms: ${input.bedrooms}, Age: ${input.propertyAge}`;
    }
    const prompt = `
    Act as a senior Real Estate Investment Analyst & Surveyor for Trivandrum (Thiruvananthapuram).
    
    Your Task: Determine the **SINGLE MEDIAN Market Land Rate** (per cent) and **Construction Cost** (per sqft) for the given location.
    
    INPUT DATA:
    - Type: ${input.type}
    - Locality: ${input.locality}
    - Land Size: ${input.plotArea} cents
    - Beach Distance: ${input.distanceToBeach} km
    - Specs: ${features}
    - REFERENCE BENCHMARKS (Lakhs/cent):
      - Premium (Kowdiar): ~${BENCHMARK_RATES.PREMIUM}
      - Tech Hub (Kazhakkoottam): ~${BENCHMARK_RATES.TECH_HUB}
      - City Avg: ~${BENCHMARK_RATES.CITY_AVG}
      - Suburb: ~${BENCHMARK_RATES.SUBURB}
    MARKET DATA CONTEXT (PRIORITIZE THESE SOURCES):
    ${sources.map((s, i) => `${i + 1}. ${s.title} (${s.uri})`).join('\n    ')}
    STEP 1: DETERMINE MEDIAN LAND RATE (Lakhs per Cent)
    - Analyze the locality and sources.
    - Provide a **SINGLE MEDIAN** estimate for the LAND RATE per cent.
    - **Kazhakkoottam Specific**: Expect 12-18 Lakhs/cent. If > 25, assume commercial and adjust down for residential.
    - **Guardrails**: If Locality is 'Kowdiar', Rate > 25. If 'St. Andrews' < 1km from beach, Rate > 8.
    STEP 2: DETERMINE CONSTRUCTION COST (Rupees per Sqft) - If applicable
    - Standard: ₹2800 - ₹3200
    - Premium: ₹3500+
    - Adjust based on "Premium" or "Standard" vibe of the locality.
    STEP 3: ANALYZE EXTRAS
    - NRI Suitability, Geospatial features, Investment potential.
    CRITICAL DATA QUALITY RULES:
    1. ALL prices MUST be in LAKHS only (never Rupees)
    2. Comparables MUST have valid HTTP/HTTPS links from the MARKET DATA CONTEXT sources
    3. If no valid comparables found in sources, return empty array []
    4. Market depth listings MUST be realistic extrapolations based on the provided sources
    5. NO hallucinated, synthetic, or dummy data allowed
    6. **GEOGRAPHIC RESTRICTION**: ALL listings MUST from Trivandrum/Thiruvananthapuram, Kerala ONLY
       - REJECT any listings from Gujarat, Mumbai, Delhi, Bangalore, or other states/cities
       - ONLY accept listings explicitly mentioning Trivandrum, Thiruvananthapuram, or Kerala localities
       - If listing location is unclear or from wrong city, DO NOT include it
    RETURN STRICTLY VALID JSON ONLY (NO COMMENTS):
    {
      "medianLandRate": number (in Lakhs per cent),
      "constructionRate": number (in Rupees per sqft),
      "explanation": "Short textual summary of why this rate was chosen.",
      "recommendation": "One sentence advice.",
      "investment": {
         "rentalYield": "string",
         "appreciationForecast": "string",
         "demandTrend": "High" | "Moderate" | "Low",
         "marketSentiment": "string"
      },
       "geoSpatial": {
          "growthDrivers": ["string", "string"],
          "microMarkets": [
             { "name": "string (specific area/road name)", "priceLevel": "High/Med/Low", "description": "string" }
          ],
           "marketDepth": [
             {
               "id": number,
               "title": "Actual property listing title from sources",
               "size": number (in cents),
               "price": number (MUST be in Lakhs, NOT Rupees),
               "type": "Premium" | "Mid-Range" | "Budget",
               "link": "Valid HTTP URL from sources or empty string if unavailable",
               "latOffset": number (small offset like 0.001 to 0.01),
               "lngOffset": number (small offset like 0.001 to 0.01)
             }
           ]
        },
        "developerAnalysis": {
           "maxVillas": number,
           "projectedSalePrice": number (in Lakhs per villa),
           "demandForVillas": "High" | "Moderate" | "Low",
           "comparables": [
              {
                "id": number,
                "title": "EXACT listing title from MARKET DATA CONTEXT sources above",
                "size": number (in cents - MUST be within 50% of user's plot size),
                "price": number (MUST be in Lakhs, NOT Rupees - divide by 100000 if needed),
                "link": "MUST be valid HTTP/HTTPS URL from sources above, NO dummy links",
                "type": "Premium" | "Mid-Range" | "Budget"
              }
           ]
        }
     }
    
    NOTE: nriMetrics is calculated locally using GPS data. Do NOT include terrain, neighborhoodVibe, or priceGradient - these are deprecated.
    CRITICAL SIZE MATCHING RULE FOR COMPARABLES:
    - If user's plot is 5 cents, comparables MUST be between 2.5-10 cents (within 50% range)
    - If user's plot is 10 cents, comparables MUST be between 5-20 cents
    - NEVER return listings that are 100x or more different (e.g., acres vs cents)
    - If no similar-sized listings found in sources, return empty array []
    VALIDATION CHECKLIST BEFORE RETURNING:
    - [ ] All prices are in Lakhs (not Rupees)
    - [ ] All comparable links start with http:// or https://
    - [ ] Comparable titles match actual listings from sources
    - [ ] Comparable sizes are within 50% of user's input size
    - [ ] ALL listings are from Trivandrum/Kerala ONLY (no Gujarat, Mumbai, other states)
    - [ ] If no valid comparables found, comparables array is []
    - [ ] Market depth listings have realistic details
  `;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.0,
          seed: 42,
        },
      });
      const text = response.text || "{}";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : "{}";
      try {
        aiData = JSON.parse(jsonString);
      } catch (e) {
        console.error("JSON Parse Error", text);
        aiData = { medianLandRate: 0, explanation: "Error parsing data." };
      }
      // Step 4: Validate AI result against baseline
      const aiRate = Number(aiData.medianLandRate || 0);
      if (baseline && baseline.median_rate) {
        const baselineRate = Number(baseline.median_rate);
        const variance = Math.abs((aiRate - baselineRate) / baselineRate) * 100;
        // If AI rate deviates >30% from baseline, use baseline instead
        if (variance > 30) {
          console.log(`AI rate ${aiRate} deviates ${variance.toFixed(1)}% from baseline ${baselineRate}. Using baseline.`);
          medianLandRate = baselineRate;
        } else {
          medianLandRate = aiRate;
        }
      } else {
        // No baseline yet, use AI result
        medianLandRate = aiRate;
      }
      // Step 5: Store result for future baseline
      if (medianLandRate && medianLandRate > 0) {
        await storeSearchResult(locality, medianLandRate);
        await updateCache(locality, medianLandRate);
      }
    } catch (error) {
      console.error("API Error:", error);
      // If AI fails but we have baseline, use it
      if (baseline?.median_rate) {
        console.log("AI failed, using baseline");
        medianLandRate = Number(baseline.median_rate);
      } else {
        throw new Error("Failed to fetch prediction.");
      }
    }
  }
  // Step 6: Calculate confidence
  const sampleSize = baseline?.sample_size || (cachedRate ? 1 : 0);
  const stdDev = baseline?.std_deviation || 0;
  const variance = baseline?.median_rate ? (stdDev / baseline.median_rate) * 100 : 50;
  const confidence = calculateConfidence(baseline, sampleSize, variance);
  // --- DETERMINISTIC CALCULATION ENGINE ---
  const isPlot = input.type === PropertyType.PLOT;
  const plotArea = input.plotArea || 0;
  const builtArea = input.builtArea || 0;
  const isHouse = !isPlot && builtArea > 0;
  // Land Value Calculation
  const rate = medianLandRate || 0;
  const landRateMin = rate * 0.90;
  const landRateMax = rate * 1.10;
  const landValueMin = landRateMin * plotArea;
  const landValueMax = landRateMax * plotArea;
  const landValueAvg = rate * plotArea;
  // Structure Value Calculation
  let structureValue = 0;
  let constructionRate = 0;
  let depreciation = 0;
  if (isHouse) {
    constructionRate = Number(aiData.constructionRate || 3000);

    // Fixed: Match actual form dropdown values
    if (input.propertyAge?.includes('> 10') || input.propertyAge?.includes('Old')) {
      depreciation = 0.35; // 35% for old properties
    } else if (input.propertyAge?.includes('< 10') || input.propertyAge?.includes('Resale')) {
      depreciation = 0.15; // 15% for resale properties
    } else {
      depreciation = 0.0; // 0% for brand new
    }

    console.log(`🏗️ Construction: Rate=₹${constructionRate}/sqft, Age="${input.propertyAge}", Depreciation=${depreciation * 100}%`);

    structureValue = (builtArea * constructionRate / 100000) * (1 - depreciation);
  }
  // Total Value
  const totalMin = landValueMin + structureValue;
  const totalMax = landValueMax + structureValue;
  // Road Access Adjustment
  let roadAdjFactor = 1.0;
  let roadAdjText = "0%";
  if (input.roadWidth === 'Narrow') {
    roadAdjFactor = 0.90;
    roadAdjText = "-10% (Narrow Access)";
  } else if (input.roadWidth === 'Lorry Access') {
    roadAdjFactor = 1.05;
    roadAdjText = "+5% (Wide Access)";
  }
  const finalMin = Number((totalMin * roadAdjFactor).toFixed(2));
  const finalMax = Number((totalMax * roadAdjFactor).toFixed(2));
  // Breakdown
  const breakdown = {
    landRatePerCent: rate,
    landTotal: Number(landValueAvg.toFixed(2)),
    structureRatePerSqFt: constructionRate,
    structureTotalBeforeDepreciation: Number((builtArea * constructionRate / 100000).toFixed(2)),
    depreciationPercentage: depreciation * 100,
    finalStructureValue: Number(structureValue.toFixed(2)),
    roadAccessAdjustment: roadAdjText
  };
  // Calculate NRI metrics deterministically (not from AI)
  const nriMetrics = generateNRIMetrics(
    input.locality,
    input.plotArea,
    input.distanceToBeach
  );

  return {
    minPrice: finalMin,
    maxPrice: finalMax,
    currency: "INR",
    explanation: aiData.explanation || "Estimation based on market trends.",
    recommendation: aiData.recommendation || "N/A",
    sources: sources,
    estimatedLandValue: Number(landValueAvg.toFixed(2)),
    estimatedStructureValue: Number(structureValue.toFixed(2)),
    breakdown: breakdown,
    investment: aiData.investment,
    nriMetrics: nriMetrics, // Calculated deterministically with GPS!
    geoSpatial: aiData.geoSpatial, // AI-generated (will be Phase 3)
    developerAnalysis: aiData.developerAnalysis,
    confidence: confidence,
    propertyMarkers: propertyMarkers // NEW: Deterministic markers
  };
};
