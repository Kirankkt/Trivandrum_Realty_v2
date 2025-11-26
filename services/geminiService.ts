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
    return sources;
  } catch (error) {
    console.error('Error fetching sources from Serper:', error);
    return [];
  }
};
export const predictPrice = async (input: UserInput): Promise<PredictionResult> => {
  // Fetch real sources first
  const sources = await fetchRealSources(input.locality);
  // Initialize client strictly inside the function to prevent crash on app load
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
    
    Your Task: Determine Market Value, NRI Suitability, and DEEP GEOSPATIAL CLUSTERING.
    
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
      - City Avg: ~${BENCHMARK_RATES.CITY_AVG}
      - Suburb: ~${BENCHMARK_RATES.SUBURB}
    MARKET DATA CONTEXT (PRIORITIZE THESE SOURCES):
    ${sources.map((s, i) => `${i + 1}. ${s.title} (${s.uri})`).join('\n    ')}
    VALUATION ALGORITHM (STRICTLY FOLLOW THIS):
    
    STEP 1: FIND THE LAND RATE (R)
    - Search for "Land price per cent in ${input.locality} Trivandrum 2024 2025".
    - Find the MEDIAN asking rate.
    - **CRITICAL**: ALL MONETARY VALUES MUST BE IN **LAKHS**. DO NOT USE RUPEES. (e.g. 5 Lakhs, NOT 500000).
    - **Guardrails**: 
      - If Locality is 'Kowdiar' or 'Sasthamangalam', R must be >= 25 Lakhs/cent.
      - If Locality is 'St. Andrews' or 'Veli' AND Distance < 1km, R must be >= 8 Lakhs/cent.
      - **MAXIMUM CAP**: Unless there is explicit evidence of "Commercial" zoning, CAP residential land rates at 2.5x the City Avg (approx 25-30 Lakhs/cent) for non-premium areas.
      - **Kazhakkoottam Specific**: Expect 12-18 Lakhs/cent. If > 25, assume commercial and adjust down for residential query.
    - **Rounding**: Round R to the nearest 0.25 Lakhs.
    
    STEP 2: CALCULATE LAND VALUE
    - Land Value = R * ${input.plotArea} (Result in LAKHS)
    STEP 3: CALCULATE STRUCTURE VALUE (S) - If Property
    - If Plot, S = 0.
    - Construction Cost (C): Use ₹2800/sqft as baseline for standard, ₹3500/sqft for premium.
    - Depreciation (D):
      - New: 0%
      - < 10 Years: 15%
      - > 10 Years: 35%
    - Structure Value = (${input.builtArea || 0} * C / 100000) * (1 - D/100). (Convert C to Lakhs)
    STEP 4: ADJUSTMENTS
    - Calculate Total = Land Value + Structure Value.
    - Apply Road Adjustment:
      - Wide/Lorry: +5%
      - Narrow: -10%
      - Car: 0%
    
    STEP 5: DEVELOPER & NRI INSIGHTS
    - Estimate Distance to Trivandrum International Airport (TRV).
    - Estimate Distance to Lulu Mall Trivandrum.
    - **The Mom Test (Social Infra)**:
      - Identify the nearest **International/Reputed School** (e.g. TRIS, Loyola, St. Thomas) to ${input.locality}. Return Name and Est. Distance.
      - Identify the nearest **Major Hospital** (e.g. KIMS, Medical College, Ananthapuri) to ${input.locality}. Return Name and Est. Distance.
    - Calculate NRI Suitability Score (0-10):
      - Base 5.
      - +2 if Airport < 8km.
      - +2 if Beach < 2km OR Locality is "Kowdiar"/"Sasthamangalam".
      - +1 if Mall < 6km.
      - +1 if School or Hospital < 5km.
      - -2 if Road Width is "Narrow".
      - Max is 10.
    - Villa Feasibility:
      - TRUE if Plot >= 4 cents AND Road != "Narrow".
      - FALSE otherwise.
    STEP 6: GEOSPATIAL CLUSTERING
    - Analyze Terrain: Is ${input.locality} hilly/elevated or coastal flatland?
    - Analyze Vibe: Pure Residential, Commercial Mix, or Developing?
    - Analyze Price Gradient: e.g., "Prices higher near Main Road."
    - Identify 2-3 "Micro-Markets" inside ${input.locality} (e.g. "Near Junction: High Price", "Interior: Budget").
          - Vary prices based on "Premium", "Mid-Range", "Budget" clusters typical for this area.
    STEP 7: DEVELOPER ANALYSIS (ROI & COMPARABLES)
    - **Comparables**: Extract the TOP 3 most relevant listings from the "MARKET DATA CONTEXT" above.
      - Must be similar in size/type to the input.
      - Return Title, Size (cents), Price (Lakhs), and Link.
    - **Project Feasibility**:
      - Estimate maxVillas that can fit on this plot (assume 4 cents/villa + road).
      - Estimate projectedSalePrice per villa (Land + 2000sqft Premium Villa + 25% Margin).
      - Estimate demandForVillas (High/Med/Low).
    
    RETURN STRICTLY VALID JSON ONLY (NO COMMENTS):
    {
      "minPrice": number,
      "maxPrice": number,
      "currency": "INR",
      "explanation": "Short textual summary.",
      "recommendation": "One sentence advice.",
      "estimatedLandValue": number,
      "estimatedStructureValue": number,
      "breakdown": {
        "landRatePerCent": number,
        "landTotal": number,
        "structureRatePerSqFt": number,
        "structureTotalBeforeDepreciation": number,
        "depreciationPercentage": number,
        "finalStructureValue": number,
        "roadAccessAdjustment": string
      },
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
            { "id": 1, "size": number, "price": number, "type": "Premium" }
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
        temperature: 0.1, // Slight creativity for data generation
        seed: 42,
        topK: 1,
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
      data = { minPrice: 0, maxPrice: 0, explanation: "Error parsing data." };
    }
    // Sources are already fetched from Serper API at the beginning of the function
    // Sanitize Breakdown Data (Force numbers)
    let landRate = Number(data.breakdown?.landRatePerCent || 0);
    // Guardrail: If rate is > 500, it's likely in Rupees. Convert to Lakhs.
    if (landRate > 500) {
      landRate = landRate / 100000;
    }
    let landTotal = Number(data.breakdown?.landTotal || 0);
    if (landTotal > 10000) { // > 100 Cr is suspicious for land total
      landTotal = landTotal / 100000;
    }
    let structureTotal = Number(data.breakdown?.finalStructureValue || 0);
    if (structureTotal > 5000) {
      structureTotal = structureTotal / 100000;
    }
    const breakdown = data.breakdown ? {
      landRatePerCent: landRate,
      landTotal: landTotal,
      structureRatePerSqFt: Number(data.breakdown.structureRatePerSqFt || 0),
      structureTotalBeforeDepreciation: Number(data.breakdown.structureTotalBeforeDepreciation || 0),
      depreciationPercentage: Number(data.breakdown.depreciationPercentage || 0),
      finalStructureValue: structureTotal,
      roadAccessAdjustment: String(data.breakdown.roadAccessAdjustment || '0%')
    } : undefined;
    // Sanitize NRI Metrics
    const nriMetrics = data.nriMetrics ? {
      suitabilityScore: Number(data.nriMetrics.suitabilityScore || 0),
      airportDist: Number(data.nriMetrics.airportDist || 0),
      mallDist: Number(data.nriMetrics.mallDist || 0),
      isVillaFeasible: Boolean(data.nriMetrics.isVillaFeasible),
      villaFeasibilityReason: String(data.nriMetrics.villaFeasibilityReason || ""),
      socialInfra: data.nriMetrics.socialInfra ? {
        nearestSchool: {
          name: String(data.nriMetrics.socialInfra.nearestSchool?.name || "N/A"),
          distance: Number(data.nriMetrics.socialInfra.nearestSchool?.distance || 0)
        },
        nearestHospital: {
          name: String(data.nriMetrics.socialInfra.nearestHospital?.name || "N/A"),
          distance: Number(data.nriMetrics.socialInfra.nearestHospital?.distance || 0)
        }
      } : undefined
    } : undefined;
    let minPrice = Number(data.minPrice || 0);
    if (minPrice > 10000) minPrice = minPrice / 100000;
    let maxPrice = Number(data.maxPrice || 0);
    if (maxPrice > 10000) maxPrice = maxPrice / 100000;
    let estimatedLandValue = Number(data.estimatedLandValue || 0);
    if (estimatedLandValue > 10000) estimatedLandValue = estimatedLandValue / 100000;
    let estimatedStructureValue = Number(data.estimatedStructureValue || 0);
    if (estimatedStructureValue > 5000) estimatedStructureValue = estimatedStructureValue / 100000;
    return {
      minPrice: minPrice,
      maxPrice: maxPrice,
      currency: "INR",
      explanation: data.explanation || "Estimation based on market trends.",
      recommendation: data.recommendation || "N/A",
      sources: sources,
      estimatedLandValue: estimatedLandValue,
      estimatedStructureValue: estimatedStructureValue,
      breakdown: breakdown,
      investment: data.investment,
      nriMetrics: nriMetrics,
      geoSpatial: data.geoSpatial,
      developerAnalysis: data.developerAnalysis ? {
        maxVillas: Number(data.developerAnalysis.maxVillas || 1),
        projectedSalePrice: Number(data.developerAnalysis.projectedSalePrice || 0),
        demandForVillas: data.developerAnalysis.demandForVillas || 'Moderate',
        comparables: Array.isArray(data.developerAnalysis.comparables) ? data.developerAnalysis.comparables.map((c: any, i: number) => ({
          id: i,
          title: c.title || "Listing",
          size: Number(c.size || 0),
          price: Number(c.price || 0),
          link: c.link || "",
          type: 'Mid-Range' // Default
        })) : []
      } : undefined
    };
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch prediction.");
  }
};



