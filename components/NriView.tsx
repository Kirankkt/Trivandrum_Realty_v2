
import React from 'react';
import { PredictionResult } from '../types';

interface NriViewProps {
  result: PredictionResult | null;
}

const NriView: React.FC<NriViewProps> = ({ result }) => {
  if (!result || !result.nriMetrics) return null;

  const { nriMetrics } = result;

  return (
    <div className="space-y-6 animate-fade-in-up">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 text-white shadow-xl border border-slate-700">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold flex items-center text-amber-400">
                    <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    NRI & Developer Analysis
                </h3>
                <span className="px-4 py-1.5 bg-slate-700 rounded-full text-sm font-medium text-slate-300 border border-slate-600">
                    Target: American Expats
                </span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Score Card */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 flex flex-col items-center justify-center text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-4">Suitability Score</p>
                    <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path className={`${nriMetrics.suitabilityScore >= 7 ? 'text-green-500' : nriMetrics.suitabilityScore >= 4 ? 'text-yellow-500' : 'text-red-500'}`} 
                                  strokeDasharray={`${nriMetrics.suitabilityScore * 10}, 100`} 
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                  fill="none" stroke="currentColor" strokeWidth="3" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                             <span className="text-4xl font-bold text-white">{nriMetrics.suitabilityScore}</span>
                             <span className="text-xs text-slate-500">/ 10</span>
                        </div>
                    </div>
                </div>

                {/* Connectivity */}
                <div className="space-y-4 flex flex-col justify-center">
                    <h4 className="text-sm font-semibold text-slate-400 uppercase">Key Connectivity</h4>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center transition hover:bg-slate-700/50">
                         <div className="flex items-center">
                            <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                            <span className="text-slate-200">Intl Airport (TRV)</span>
                         </div>
                         <span className="font-mono font-bold text-white">{nriMetrics.airportDist} km</span>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center transition hover:bg-slate-700/50">
                         <div className="flex items-center">
                            <svg className="w-5 h-5 text-pink-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            <span className="text-slate-200">Lulu Mall</span>
                         </div>
                         <span className="font-mono font-bold text-white">{nriMetrics.mallDist} km</span>
                    </div>
                </div>

                {/* Feasibility */}
                <div className={`p-6 rounded-2xl border flex flex-col justify-center items-center text-center ${nriMetrics.isVillaFeasible ? 'bg-emerald-900/20 border-emerald-800' : 'bg-red-900/20 border-red-800'}`}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Villa Project Feasibility</p>
                    {nriMetrics.isVillaFeasible ? (
                        <div className="mb-3 p-3 bg-emerald-900/40 rounded-full">
                             <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                    ) : (
                        <div className="mb-3 p-3 bg-red-900/40 rounded-full">
                             <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </div>
                    )}
                    <span className={`text-xl font-bold mb-2 ${nriMetrics.isVillaFeasible ? 'text-emerald-400' : 'text-red-400'}`}>
                        {nriMetrics.isVillaFeasible ? "Feasible" : "Not Recommended"}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-[200px]">{nriMetrics.villaFeasibilityReason}</p>
                </div>
             </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h4 className="font-bold text-gray-800 mb-3">Expert Recommendation for NRI Buyers</h4>
             <p className="text-gray-600 leading-relaxed">
                Based on the distance to the airport ({nriMetrics.airportDist}km) and the nature of {nriMetrics.isVillaFeasible ? 'good' : 'limited'} road access, 
                this location is {nriMetrics.suitabilityScore > 7 ? 'highly' : nriMetrics.suitabilityScore > 4 ? 'moderately' : 'less'} suited for an NRI vacation home or rental investment.
             </p>
        </div>
    </div>
  );
};

export default NriView;
