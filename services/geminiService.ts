
import { GoogleGenAI } from "@google/genai";
import { UserInput, PredictionResult, PropertyType, Source } from "../types";

export const predictPrice = async (input: UserInput): Promise<PredictionResult> => {
  // Initialize client strictly inside the function to prevent crash on app load
  const apiKey = process.env.API_KEY;
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

    VALUATION ALGORITHM (STRICTLY FOLLOW THIS):
    
    STEP 1: FIND THE LAND RATE (R)
    - Search for "Land price per cent in ${input.locality} Trivandrum 2024 2025".
    - Find the MEDIAN asking rate.
    - **Guardrails**: 
      - If Locality is 'Kowdiar' or 'Sasthamangalam', R must be >= 25 Lakhs/cent.
      - If Locality is 'St. Andrews' or 'Veli' AND Distance < 1km, R must be >= 8 Lakhs/cent.
      - If Locality is inland (>2km from sea), IGNORE beach distance for pricing.
    - **Rounding**: Round R to the nearest 0.25 Lakhs.
    
    STEP 2: CALCULATE LAND VALUE
    - Land Value = R * ${input.plotArea}

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
    - Calculate NRI Suitability Score (0-10):
      - Base 5.
      - +2 if Airport < 8km.
      - +2 if Beach < 2km OR Locality is "Kowdiar"/"Sasthamangalam".
      - +1 if Mall < 6km.
      - -2 if Road Width is "Narrow".
      - Max is 10.
    - Villa Feasibility:
      - TRUE if Plot >= 4 cents AND Road != "Narrow".
      - FALSE otherwise.

    STEP 6: GEOSPATIAL CLUSTERING (NEW)
    - Analyze Terrain: Is ${input.locality} hilly/elevated or coastal flatland?
    - Analyze Vibe: Pure Residential, Commercial Mix, or Developing?
    - Analyze Price Gradient: e.g., "Prices higher near Main Road."
    - Identify 2-3 "Micro-Markets" inside ${input.locality} (e.g. "Near Junction: High Price", "Interior: Budget").
    - Generate "Market Depth" data: Create 12 simulated comparable listings for a Scatter Plot.
         - Vary sizes slightly around ${input.plotArea} cents.
         - Vary prices based on "Premium", "Mid-Range", "Budget" clusters typical for this area.

    RETURN JSON ONLY:
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
         "rentalYield": "string (e.g. 3.5%)",
         "appreciationForecast": "string (e.g. 8% Annually)",
         "demandTrend": "High" | "Moderate" | "Low",
         "marketSentiment": "string (Brief reason for trend)"
      },
      "nriMetrics": {
         "suitabilityScore": number,
         "airportDist": number,
         "mallDist": number,
         "isVillaFeasible": boolean,
         "villaFeasibilityReason": "string"
      },
      "geoSpatial": {
         "terrain": "string (e.g. Elevated/Hilly)",
         "neighborhoodVibe": "string",
         "priceGradient": "string",
         "growthDrivers": ["string", "string"],
         "microMarkets": [
            { "name": "string", "priceLevel": "High/Med/Low", "description": "string" }
         ],
         "marketDepth": [
            { "id": 1, "size": number, "price": number, "type": "Premium" }
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

    // Extract sources
    const sources: Source[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    // Sanitize Breakdown Data (Force numbers)
    const breakdown = data.breakdown ? {
        landRatePerCent: Number(data.breakdown.landRatePerCent || 0),
        landTotal: Number(data.breakdown.landTotal || 0),
        structureRatePerSqFt: Number(data.breakdown.structureRatePerSqFt || 0),
        structureTotalBeforeDepreciation: Number(data.breakdown.structureTotalBeforeDepreciation || 0),
        depreciationPercentage: Number(data.breakdown.depreciationPercentage || 0),
        finalStructureValue: Number(data.breakdown.finalStructureValue || 0),
        roadAccessAdjustment: String(data.breakdown.roadAccessAdjustment || '0%')
    } : undefined;

    // Sanitize NRI Metrics
    const nriMetrics = data.nriMetrics ? {
        suitabilityScore: Number(data.nriMetrics.suitabilityScore || 0),
        airportDist: Number(data.nriMetrics.airportDist || 0),
        mallDist: Number(data.nriMetrics.mallDist || 0),
        isVillaFeasible: Boolean(data.nriMetrics.isVillaFeasible),
        villaFeasibilityReason: String(data.nriMetrics.villaFeasibilityReason || "")
    } : undefined;

    return {
      minPrice: Number(data.minPrice || 0),
      maxPrice: Number(data.maxPrice || 0),
      currency: "INR",
      explanation: data.explanation || "Estimation based on market trends.",
      recommendation: data.recommendation || "N/A",
      sources: sources,
      estimatedLandValue: Number(data.estimatedLandValue || 0),
      estimatedStructureValue: Number(data.estimatedStructureValue || 0),
      breakdown: breakdown,
      investment: data.investment,
      nriMetrics: nriMetrics,
      geoSpatial: data.geoSpatial
    };

  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch prediction.");
  }
};


