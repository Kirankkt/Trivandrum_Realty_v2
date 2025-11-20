
export enum PropertyType {
  PROPERTY = 'Property (House/Villa)',
  PLOT = 'Plot (Land Only)'
}

export interface UserInput {
  type: PropertyType;
  locality: string;
  distanceToBeach: number; // in km
  plotArea: number; // Cents
  builtArea?: number; // Sq ft (Only for Property)
  bedrooms?: number; // Only for Property
  propertyAge?: string; // New, <5, 5-10, >10
  roadWidth?: string; // Lorry access, Car access, Narrow
}

export interface Source {
  title: string;
  uri: string;
}

export interface CalculationBreakdown {
  landRatePerCent: number; // In Lakhs
  landTotal: number; // In Lakhs
  structureRatePerSqFt: number; // In Rupees
  structureTotalBeforeDepreciation: number; // In Lakhs
  depreciationPercentage: number; // 0 to 100
  finalStructureValue: number; // In Lakhs
  roadAccessAdjustment: string; // e.g., "+5%"
}

export interface InvestmentMetrics {
  rentalYield: string; // e.g., "3.5%"
  appreciationForecast: string; // e.g., "8-10% Annually"
  demandTrend: 'High' | 'Moderate' | 'Low';
  marketSentiment: string; // Short sentence
}

export interface NriMetrics {
  suitabilityScore: number; // 0 to 10
  airportDist: number; // in km (Estimate)
  mallDist: number; // in km (Lulu)
  isVillaFeasible: boolean;
  villaFeasibilityReason: string;
}

export interface Comparable {
  id: number;
  size: number; // Cents or Sqft
  price: number; // In Lakhs
  type: 'Premium' | 'Mid-Range' | 'Budget';
}

export interface GeospatialAnalysis {
  terrain: string; // e.g., "Elevated / Hilly", "Coastal Flatland"
  neighborhoodVibe: string; // e.g., "Quiet Residential", "Commercial Hub"
  priceGradient: string; // e.g., "Prices higher towards Kowdiar axis"
  growthDrivers: string[]; // List of nearby developments
  microMarkets: { name: string; priceLevel: string; description: string }[]; // e.g. "Golf Links Rd: High"
  marketDepth: Comparable[]; // Simulated comparable properties for clustering chart
}

export interface PredictionResult {
  minPrice: number; // In Lakhs
  maxPrice: number; // In Lakhs
  currency: string;
  explanation: string;
  recommendation: string;
  sources: Source[];
  estimatedLandValue?: number; // Separate estimate for land
  estimatedStructureValue?: number; // Separate estimate for building
  breakdown?: CalculationBreakdown; // Detailed math
  investment?: InvestmentMetrics; // New investment data
  nriMetrics?: NriMetrics; // Developer/NRI data
  geoSpatial?: GeospatialAnalysis; // New Map/Terrain data
}

export interface ChartData {
  name: string;
  price: number;
}

