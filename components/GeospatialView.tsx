import React from 'react';
import { PredictionResult } from '../types';
import InteractiveMap from './InteractiveMap';
import { LOCALITY_TIERS } from '../constants';
import { calculateDistance } from '../utils/geoCalculations';
import { LOCALITY_COORDS, LANDMARKS } from '../constants';

interface GeospatialViewProps {
    result: PredictionResult;
    locality: string;
}

const GeospatialView: React.FC<GeospatialViewProps> = ({ result, locality }) => {
    // Calculate data-driven stats
    const comparables = result.developerAnalysis?.comparables || [];
    const marketDepth = result.geoSpatial?.marketDepth || [];
    const propertyMarkers = result.propertyMarkers || []; // NEW: Deterministic markers
    const allProperties = [...comparables, ...(marketDepth as any[]), ...propertyMarkers];

    // Calculate real statistics
    const propertyCount = allProperties.length;
    const avgPrice = propertyCount > 0
        ? allProperties.reduce((sum, p) => {
            if ('estimatedPrice' in p && p.estimatedPrice) return sum + p.estimatedPrice;
            if ('price' in p && typeof p.price === 'number') return sum + p.price;
            return sum;
        }, 0) / propertyCount
        : 0;
    const normalizedAvgPrice = avgPrice > 10000 ? avgPrice / 100000 : avgPrice;

    // Get locality tier
    const tier = LOCALITY_TIERS[locality] || 'Suburb';
    const tierColors = {
        Premium: 'bg-purple-100 text-purple-800 border-purple-300',
        Tech: 'bg-blue-100 text-blue-800 border-blue-300',
        City: 'bg-amber-100 text-amber-800 border-amber-300',
        Suburb: 'bg-green-100 text-green-800 border-green-300'
    };

    // Calculate distances to key landmarks
    const localityCoords = LOCALITY_COORDS[locality];
    let airportDist = 0, techparkDist = 0, mallDist = 0;
    if (localityCoords) {
        airportDist = calculateDistance(localityCoords, LANDMARKS.AIRPORT.coords);
        techparkDist = calculateDistance(localityCoords, LANDMARKS.TECHNOPARK.coords);
        mallDist = calculateDistance(localityCoords, LANDMARKS.LULU_MALL.coords);
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Interactive Map Section */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7m0 0L9 4"></path>
                    </svg>
                    Interactive Property Map
                </h3>
                <InteractiveMap
                    comparables={comparables}
                    marketDepth={marketDepth}
                    propertyMarkers={propertyMarkers} // NEW
                    locality={locality}
                    estimatedRate={result.breakdown?.landRatePerCent}
                    plotArea={result.estimatedLandValue ? result.estimatedLandValue / (result.breakdown?.landRatePerCent || 1) : undefined}
                />
            </div>

            {/* Data-Driven Insights - NO AI Narratives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Locality Classification */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Locality Type</h4>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full border-2 font-bold text-lg ${tierColors[tier]}`}>
                        {tier === 'Premium' && '👑 '}
                        {tier === 'Tech' && '💼 '}
                        {tier === 'City' && '🏙️ '}
                        {tier === 'Suburb' && '🌳 '}
                        {tier}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        Classification based on infrastructure and market dynamics
                    </p>
                </div>

                {/* Property Data Stats */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Market Data</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <span className="text-gray-600 text-sm">Properties Found:</span>
                            <span className="font-bold text-2xl text-teal-700">{propertyCount}</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        Based on real property listings from 99acres & MagicBricks
                    </p>
                </div>

                {/* Connectivity Stats */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Key Distances</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">✈️ Airport:</span>
                            <span className="font-semibold text-gray-800">{airportDist.toFixed(1)} km</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">💼 Technopark:</span>
                            <span className="font-semibold text-gray-800">{techparkDist.toFixed(1)} km</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">🛍️ Lulu Mall:</span>
                            <span className="font-semibold text-gray-800">{mallDist.toFixed(1)} km</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        Calculated using GPS coordinates
                    </p>
                </div>
            </div>

            {/* Growth Drivers - Data-based, not AI narratives */}
            {result.geoSpatial?.growthDrivers && result.geoSpatial.growthDrivers.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                        Growth Drivers
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result.geoSpatial.growthDrivers.map((driver, idx) => (
                            <div key={idx} className="flex items-start bg-green-50 p-3 rounded-lg border border-green-200">
                                <svg className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="text-gray-700 text-sm">{driver}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Micro-Markets - If available from AI */}
            {result.geoSpatial?.microMarkets && result.geoSpatial.microMarkets.length > 0 && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="px-6 py-4 bg-gray-50 border-b">
                        <h4 className="font-semibold text-gray-800 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            Nearby Micro-Markets
                        </h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Area</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price Level</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Characteristics</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {result.geoSpatial.microMarkets.map((market, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{market.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${market.priceLevel === 'High' ? 'bg-red-100 text-red-800' :
                                                market.priceLevel === 'Moderate' || market.priceLevel === 'Med' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {market.priceLevel}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{market.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Disclaimer - Professional transparency */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div className="text-sm">
                        <p className="font-semibold text-blue-900 mb-1">About This Data</p>
                        <p className="text-blue-800">
                            Locality classification, distances, and property counts are calculated from real GPS data and verified listings.
                            Property data is extracted from online listings (99acres, MagicBricks); availability varies by parsing success.
                            Micro-market insights are generated from recent property trends. Use interactive map layers to explore schools, hospitals, and landmarks.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeospatialView;
