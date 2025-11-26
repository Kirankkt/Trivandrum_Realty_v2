import React, { useState } from 'react';
import { PredictionResult } from '../types';
interface HistoricalModelsProps {
    result: PredictionResult | null;
}
const HistoricalModels: React.FC<HistoricalModelsProps> = ({ result }) => {
    const [modelType, setModelType] = useState<'property' | 'plot'>('property');
    const formatCurrency = (value: number) => {
        const val = Number(value);
        if (val >= 100) return `₹${(val / 100).toFixed(2)} Cr`;
        return `₹${val.toFixed(2)} Lakhs`;
    };
    return (
        <div className="space-y-6">
            {/* Comparison Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Model Comparison</h3>
                    <p className="text-sm text-gray-500">Compare Live AI Valuation vs. Historical Statistical Models</p>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setModelType('property')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${modelType === 'property'
                                ? 'bg-white text-teal-700 shadow'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Property Predictor
                    </button>
                    <button
                        onClick={() => setModelType('plot')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${modelType === 'plot'
                                ? 'bg-white text-teal-700 shadow'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Plot Predictor
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Live AI Estimate */}
                <div className="bg-white rounded-xl shadow-lg border border-teal-100 overflow-hidden flex flex-col h-[600px]">
                    <div className="bg-teal-600 px-6 py-4 text-white">
                        <h3 className="text-lg font-medium">Live AI Valuation</h3>
                        <p className="text-teal-100 text-xs mt-1">Based on 2025 Market Listings</p>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-center items-center text-center">
                        {result ? (
                            <>
                                <div className="mb-8">
                                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Estimated Value</p>
                                    <div className="text-4xl font-bold text-teal-700">
                                        {formatCurrency(result.minPrice)} - {formatCurrency(result.maxPrice)}
                                    </div>
                                </div>
                                <div className="w-full bg-teal-50 rounded-lg p-4 border border-teal-100 mb-6">
                                    <h4 className="font-semibold text-teal-800 mb-2">AI Recommendation</h4>
                                    <p className="text-teal-700 text-sm italic">"{result.recommendation}"</p>
                                </div>
                                <div className="text-left w-full">
                                    <h4 className="font-semibold text-gray-700 mb-2 text-sm">Key Factors:</h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                                            Real-time Data Sources: {result.sources.length}
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                                            Market Demand: {result.developerAnalysis?.demandForVillas || 'Moderate'}
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-400">No estimate available. Please run a valuation first.</p>
                        )}
                    </div>
                </div>
                {/* Right Column: Historical Model */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-[600px]">
                    <div className="bg-slate-800 px-6 py-4 text-white">
                        <h3 className="text-lg font-medium">Historical Model</h3>
                        <p className="text-slate-300 text-xs mt-1">Based on 2024 Augmented Data (XGBoost)</p>
                    </div>
                    <div className="relative flex-grow bg-gray-50">
                        {/* Loading Spinner */}
                        <div className="absolute inset-0 flex items-center justify-center z-0">
                            <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                        </div>
                        {modelType === 'property' ? (
                            <iframe
                                src="https://augmentedpropertydataset-okiq2b359bugl257t8dwzx.streamlit.app/?embed=true"
                                className="absolute inset-0 w-full h-full z-10"
                                title="Property Price Predictor"
                                frameBorder="0"
                            />
                        ) : (
                            <iframe
                                src="https://augmenteddataplotpricepred-kc4ascraaeabldkyf467ft.streamlit.app/?embed=true"
                                className="absolute inset-0 w-full h-full z-10"
                                title="Plot Price Predictor"
                                frameBorder="0"
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-yellow-50 border-t border-yellow-100 p-4 rounded-lg">
                <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div>
                        <h4 className="text-sm font-bold text-yellow-800">Why the difference?</h4>
                        <p className="text-xs text-yellow-700 mt-1 leading-relaxed">
                            The <strong>Live AI Valuation</strong> (Left) uses current 2025 listings and market sentiment.
                            The <strong>Historical Model</strong> (Right) uses a statistical average of 2024 data.
                            Significant differences may indicate recent market shifts or specific property features (like road width) that the historical model doesn't capture.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default HistoricalModels;
