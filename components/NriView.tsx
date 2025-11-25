
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

                {/* Connectivity & Infra */}
                <div className="space-y-3 flex flex-col justify-center col-span-2 md:col-span-1">
                    <h4 className="text-sm font-semibold text-slate-400 uppercase mb-1">Connectivity</h4>
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 flex justify-between items-center transition hover:bg-slate-700/50">
                         <div className="flex items-center">
                            <svg className="w-4 h-4 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                            <span className="text-slate-200 text-sm">Airport (TRV)</span>
                         </div>
                         <span className="font-mono font-bold text-white">{nriMetrics.airportDist} km</span>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 flex justify-between items-center transition hover:bg-slate-700/50">
                         <div className="flex items-center">
                            <svg className="w-4 h-4 text-pink-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            <span className="text-slate-200 text-sm">Lulu Mall</span>
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

        {/* Social Infrastructure - The Mom Test */}
        {nriMetrics.socialInfra && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-fade-in-up">
                 <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                    <span className="bg-purple-100 p-1.5 rounded-lg mr-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    </span>
                    Social Infrastructure (The Mom Test)
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* School Card */}
                    <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex-shrink-0 mr-4 bg-white p-3 rounded-full shadow-sm">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nearest Top School</p>
                            <h5 className="text-lg font-bold text-gray-900">{nriMetrics.socialInfra.nearestSchool.name}</h5>
                            <div className="flex items-center mt-1">
                                <span className={`text-sm font-bold px-2 py-0.5 rounded ${nriMetrics.socialInfra.nearestSchool.distance < 5 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {nriMetrics.socialInfra.nearestSchool.distance} km
                                </span>
                                <span className="text-xs text-gray-500 ml-2">away</span>
                            </div>
                        </div>
                    </div>

                    {/* Hospital Card */}
                    <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex-shrink-0 mr-4 bg-white p-3 rounded-full shadow-sm">
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nearest Major Hospital</p>
                            <h5 className="text-lg font-bold text-gray-900">{nriMetrics.socialInfra.nearestHospital.name}</h5>
                            <div className="flex items-center mt-1">
                                <span className={`text-sm font-bold px-2 py-0.5 rounded ${nriMetrics.socialInfra.nearestHospital.distance < 5 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {nriMetrics.socialInfra.nearestHospital.distance} km
                                </span>
                                <span className="text-xs text-gray-500 ml-2">away</span>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        )}
        
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

