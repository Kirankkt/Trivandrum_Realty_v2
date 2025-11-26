import React, { useState, useEffect } from 'react';
import { PredictionResult, DeveloperAnalysis } from '../types';
interface DeveloperInsightsProps {
    result: PredictionResult;
}
const DeveloperInsights: React.FC<DeveloperInsightsProps> = ({ result }) => {
    const analysis = result.developerAnalysis;
    const landValue = result.estimatedLandValue || 0;
    // State for ROI Calculator
    const [landCost, setLandCost] = useState<number>(landValue);
    const [constructionRate, setConstructionRate] = useState<number>(3500); // Default premium
    const [salePricePerVilla, setSalePricePerVilla] = useState<number>(analysis?.projectedSalePrice || 150);
    const [numVillas, setNumVillas] = useState<number>(analysis?.maxVillas || 1);
    // Derived Calculations
    const villaSize = 2000; // Assumption
    const totalConstructionCost = (numVillas * villaSize * constructionRate) / 100000; // In Lakhs
    const totalProjectCost = landCost + totalConstructionCost;
    const totalRevenue = numVillas * salePricePerVilla;
    const netProfit = totalRevenue - totalProjectCost;
    const roi = totalProjectCost > 0 ? (netProfit / totalProjectCost) * 100 : 0;
    useEffect(() => {
        if (result.estimatedLandValue) setLandCost(result.estimatedLandValue);
        if (analysis?.projectedSalePrice) setSalePricePerVilla(analysis.projectedSalePrice);
        if (analysis?.maxVillas) setNumVillas(analysis.maxVillas);
    }, [result, analysis]);
    if (!analysis) return null;
    return (
        <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-indigo-600 text-white p-1 rounded mr-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </span>
                Developer Feasibility Mode
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ROI Calculator */}
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                    <h4 className="font-semibold text-indigo-900 mb-4 uppercase tracking-wide text-sm">Project ROI Calculator</h4>
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Land Cost (Lakhs)</label>
                            <input
                                type="number"
                                value={landCost}
                                onChange={(e) => setLandCost(Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Const. Rate (₹/sqft)</label>
                                <input
                                    type="number"
                                    value={constructionRate}
                                    onChange={(e) => setConstructionRate(Number(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">No. of Villas</label>
                                <input
                                    type="number"
                                    value={numVillas}
                                    onChange={(e) => setNumVillas(Number(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Sale Price / Villa (Lakhs)</label>
                            <input
                                type="number"
                                value={salePricePerVilla}
                                onChange={(e) => setSalePricePerVilla(Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600 text-sm">Total Project Cost:</span>
                            <span className="font-medium">₹{totalProjectCost.toFixed(2)} L</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600 text-sm">Total Revenue:</span>
                            <span className="font-medium">₹{totalRevenue.toFixed(2)} L</span>
                        </div>
                        <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between items-center">
                            <span className="font-bold text-gray-800">Net Profit:</span>
                            <span className={`font-bold ${netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ₹{netProfit.toFixed(2)} L
                            </span>
                        </div>
                        <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-semibold text-indigo-900">ROI</span>
                                <span className="font-bold text-indigo-900">{roi.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className={`h-2.5 rounded-full ${roi > 20 ? 'bg-green-500' : roi > 0 ? 'bg-yellow-400' : 'bg-red-500'}`}
                                    style={{ width: `${Math.min(Math.max(roi, 0), 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Comparables */}
                <div>
                    <h4 className="font-semibold text-gray-800 mb-4 uppercase tracking-wide text-sm flex items-center justify-between">
                        <span>Comparable Listings</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Top 3 Matches</span>
                    </h4>
                    <div className="space-y-3">
                        {analysis.comparables.length > 0 ? (
                            analysis.comparables.map((comp, idx) => (
                                <a
                                    key={idx}
                                    href={comp.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h5 className="font-medium text-gray-900 text-sm group-hover:text-indigo-600 line-clamp-1">{comp.title}</h5>
                                            <p className="text-xs text-gray-500 mt-1">{comp.size} cents • {comp.type}</p>
                                        </div>
                                        <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded">
                                            ₹{comp.price} L
                                        </span>
                                    </div>
                                </a>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic">No direct comparables found in the source data.</p>
                        )}
                    </div>
                    <div className="mt-6 bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
                        <h5 className="text-xs font-bold text-yellow-800 uppercase mb-1">Market Demand</h5>
                        <p className="text-sm text-yellow-900">
                            Demand for villas in this area is <span className="font-bold">{analysis.demandForVillas}</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DeveloperInsights;
