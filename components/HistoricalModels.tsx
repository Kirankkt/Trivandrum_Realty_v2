import React, { useState } from 'react';
const HistoricalModels: React.FC = () => {
    const [modelType, setModelType] = useState<'property' | 'plot'>('property');
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in-up">
            <div className="bg-slate-800 px-6 py-4 text-white flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium">Historical Analytics Models</h3>
                    <p className="text-slate-300 text-xs mt-1">
                        Based on 2024 Augmented Data • Powered by XGBoost
                    </p>
                </div>
                <div className="flex bg-slate-700 rounded-lg p-1">
                    <button
                        onClick={() => setModelType('property')}
                        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${modelType === 'property'
                                ? 'bg-white text-slate-900 shadow'
                                : 'text-slate-300 hover:text-white'
                            }`}
                    >
                        Property Predictor
                    </button>
                    <button
                        onClick={() => setModelType('plot')}
                        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${modelType === 'plot'
                                ? 'bg-white text-slate-900 shadow'
                                : 'text-slate-300 hover:text-white'
                            }`}
                    >
                        Plot Predictor
                    </button>
                </div>
            </div>
            <div className="relative w-full h-[600px] bg-gray-50">
                {/* Loading Spinner for Iframe */}
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
            <div className="bg-yellow-50 border-t border-yellow-100 p-4">
                <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div>
                        <h4 className="text-sm font-bold text-yellow-800">Historical Data Disclaimer</h4>
                        <p className="text-xs text-yellow-700 mt-1 leading-relaxed">
                            These models use data collected in 2024 and static statistical models (XGBoost).
                            Estimates may differ from the "Live AI Valuation" which uses real-time 2025 market listings.
                            Use these for trend analysis and baseline comparisons only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default HistoricalModels;
