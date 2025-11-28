import { GoogleGenAI } from "@google/genai";
import { UserInput, PredictionResult, PropertyType, Source } from "../types";
import { BENCHMARK_RATES } from "../constants";
// Fetch real sources using Serper API
const fetchRealSources = async (locality: string): Promise<Source[]> => {
  // Try standard Vite env var first, fallback to process.env for safety
  const serperApiKey = import.meta.env.VITE_SERPER_API_KEY || process.env.SERPER_API_KEY;
  if (!serperApiKey) {
    console.warn("Serper API Key is missing. Sources will not be available.");
    return [];
  }
  try {
    const query = `Land price per cent in ${locality} Trivandrum 2024 2025`;
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
export const predictPrice = async (input: UserInput): Promise<PredictionResult> => {
  // Fetch real sources first
  const sources = await fetchRealSources(input.locality);
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
    RETURN STRICTLY VALID JSON ONLY (NO COMMENTS):
    {
      "medianLandRate": number,
      "constructionRate": number,
      "explanation": "Short textual summary of why this rate was chosen.",
      "recommendation": "One sentence advice.",
      "investment": {
         "rentalYield": "string",
         "appreciationForecast": "string",
         "demandTrend": "High" | "Moderate" | "Low",
         "marketSentiment": "string"
      },
      "nriMetrics": {
         "suitabilityScore": number,
         "airportDist": number,
         "mallDist": number,
         "isVillaFeasible": boolean,
         "villaFeasibilityReason": "string",
         "socialInfra": {
            "nearestSchool": { "name": "string", "distance": number },
            "nearestHospital": { "name": "string", "distance": number }
         }
      },
      "geoSpatial": {
         "terrain": "string",
         "neighborhoodVibe": "string",
         "priceGradient": "string",
         "growthDrivers": ["string", "string"],
         "microMarkets": [
            { "name": "string", "priceLevel": "High/Med/Low", "description": "string" }
         ],
          "marketDepth": [
            { "id": 1, "size": number, "price": number, "type": "Premium" | "Mid-Range" | "Budget", "latOffset": number, "lngOffset": number }
          ]
       },
       "developerAnalysis": {
          "maxVillas": number,
          "projectedSalePrice": number,
          "demandForVillas": "High" | "Moderate" | "Low",
          "comparables": [
             { "id": 1, "title": "string", "size": number, "price": number, "link": "string" }
          ]
       }
    }
  `;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.0, // Zero temperature for maximum consistency
        seed: 42,
      },
    });
    const text = response.text || "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : "{}";
    let data: any = {};
    try {
      data = JSON.parse(jsonString);
    } catch (e) {
      console.error("JSON Parse Error", text);
      data = { medianLandRate: 0, explanation: "Error parsing data." };
    }
    // --- DETERMINISTIC CALCULATION ENGINE V2 ---
    // 1. Inputs
    const plotArea = input.plotArea || 0;
    const builtArea = input.builtArea || 0;
    const isHouse = !isPlot && builtArea > 0;
    // 2. Land Value Calculation (Single Rate + Fixed Spread)
    const medianRate = Number(data.medianLandRate || 0);
    // Apply fixed +/- 10% spread for range
    const landRateMin = medianRate * 0.90;
    const landRateMax = medianRate * 1.10;
    const landValueMin = landRateMin * plotArea;
    const landValueMax = landRateMax * plotArea;
    const landValueAvg = medianRate * plotArea;
    // 3. Structure Value Calculation (If House)
    let structureValue = 0;
    let constructionRate = 0;
    let depreciation = 0;
    if (isHouse) {
      constructionRate = Number(data.constructionRate || 3000); // Default to 3000 if missing
      // Calculate Depreciation based on Age
      if (input.propertyAge === '>10') depreciation = 0.35; // 35%
      else if (input.propertyAge === '5-10') depreciation = 0.15; // 15%
      else depreciation = 0.0; // New (<5)
      // Formula: Area * Rate * (1 - Depreciation)
      // Note: Rate is in Rupees, convert to Lakhs (/100000)
      structureValue = (builtArea * constructionRate / 100000) * (1 - depreciation);
    }
    // 4. Total Value
    const totalMin = landValueMin + structureValue;
    const totalMax = landValueMax + structureValue;
    // 5. Road Access Adjustment (Deterministic)
    let roadAdjFactor = 1.0;
    let roadAdjText = "0%";
    if (input.roadWidth === 'Narrow') {
      roadAdjFactor = 0.90; // -10%
      roadAdjText = "-10% (Narrow Access)";
    } else if (input.roadWidth === 'Lorry Access') {
      roadAdjFactor = 1.05; // +5%
      roadAdjText = "+5% (Wide Access)";
    }
    const finalMin = Number((totalMin * roadAdjFactor).toFixed(2));
    const finalMax = Number((totalMax * roadAdjFactor).toFixed(2));
    // Construct the Breakdown Object
    const breakdown = {
      landRatePerCent: medianRate, // Showing Median rate for reference
      landTotal: Number(landValueAvg.toFixed(2)), // Showing Avg land value
      structureRatePerSqFt: constructionRate,
      structureTotalBeforeDepreciation: Number((builtArea * constructionRate / 100000).toFixed(2)),
      depreciationPercentage: depreciation * 100,
      finalStructureValue: Number(structureValue.toFixed(2)),
      roadAccessAdjustment: roadAdjText
    };
    return {
      minPrice: finalMin,
      maxPrice: finalMax,
      currency: "INR",
      explanation: data.explanation || "Estimation based on market trends.",
      recommendation: data.recommendation || "N/A",
      sources: sources,
      estimatedLandValue: Number(landValueAvg.toFixed(2)),
      estimatedStructureValue: Number(structureValue.toFixed(2)),
      breakdown: breakdown,
      investment: data.investment,
      nriMetrics: data.nriMetrics,
      geoSpatial: data.geoSpatial,
      developerAnalysis: data.developerAnalysis
    };
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch prediction.");
  }
};
