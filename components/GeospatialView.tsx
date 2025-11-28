import React from 'react';
import { PredictionResult } from '../types';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import InteractiveMap from './InteractiveMap';
interface GeospatialViewProps {
    result: PredictionResult;
    locality: string;
}
const GeospatialView: React.FC<GeospatialViewProps> = ({ result, locality }) => {
    if (!result.geoSpatial) return null;
    const { geoSpatial } = result;
    // Colors for scatter plot
    const COLORS: Record<string, string> = {
        'Premium': '#0d9488', // Teal-600
        'Mid-Range': '#f59e0b', // Amber-500
        'Budget': '#64748b' // Slate-500
    };
    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Interactive Map Section */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7m0 0L9 4"></path></svg>
                    Interactive Property Map
                </h3>
                <InteractiveMap
                    comparables={result.developerAnalysis?.comparables || []}
                    marketDepth={result.geoSpatial?.marketDepth || []}
                    locality={locality}
                    estimatedRate={result.breakdown?.landRatePerCent}
                    plotArea={result.estimatedLandValue ? result.estimatedLandValue / (result.breakdown?.landRatePerCent || 1) : undefined}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Terrain & Vibe Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Location Analysis
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Terrain</p>
                            <p className="text-gray-800 font-medium">{geoSpatial.terrain}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Neighborhood Vibe</p>
                            <p className="text-gray-800 font-medium">{geoSpatial.neighborhoodVibe}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Price Gradient</p>
                            <p className="text-gray-800 text-sm">{geoSpatial.priceGradient}</p>
                        </div>
                    </div>
                </div>
                {/* Growth Drivers Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        Growth Drivers
                    </h3>
                    <ul className="space-y-2">
                        {geoSpatial.growthDrivers.map((driver, idx) => (
                            <li key={idx} className="flex items-start">
                                <svg className="w-4 h-4 text-teal-500 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span className="text-gray-700 text-sm">{driver}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {/* Market Depth Scatter Plot */}
            {geoSpatial.marketDepth && geoSpatial.marketDepth.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Depth Analysis</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" dataKey="size" name="Size" unit=" cents" />
                                <YAxis type="number" dataKey="price" name="Price" unit=" L" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Legend />
                                <Scatter name="Market Listings" data={geoSpatial.marketDepth} fill="#0d9488">
                                    {geoSpatial.marketDepth.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.type] || '#0d9488'} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-2">
                        Scatter plot of recent listings: Size (cents) vs. Price (Lakhs). Color indicates segment (Budget/Mid/Premium).
                    </p>
                </div>
            )}
            {/* Micro-Markets Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">Micro-Market Clusters</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cluster Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Level</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {geoSpatial.microMarkets.map((market, idx) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{market.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${market.priceLevel === 'High' ? 'bg-red-100 text-red-800' :
                                            market.priceLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {market.priceLevel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{market.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default GeospatialView;
