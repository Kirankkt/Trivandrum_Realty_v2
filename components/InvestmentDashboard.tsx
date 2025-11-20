
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { PredictionResult } from '../types';
import { BENCHMARK_RATES } from '../constants';

interface InvestmentDashboardProps {
  result: PredictionResult | null;
  localityName: string;
}

const InvestmentDashboard: React.FC<InvestmentDashboardProps> = ({ result, localityName }) => {
  if (!result || !result.breakdown) return null;

  const landRate = Number(result.breakdown.landRatePerCent || 0);

  // Data for Comparison Chart
  const comparisonData = [
    { name: 'Suburbs', rate: BENCHMARK_RATES.SUBURB, color: '#94a3b8' },
    { name: 'City Avg', rate: BENCHMARK_RATES.CITY_AVG, color: '#cbd5e1' },
    { name: localityName, rate: landRate, color: '#0d9488' }, // The selected locality
    { name: 'Tech Hub', rate: BENCHMARK_RATES.TECH_HUB, color: '#64748b' },
    { name: 'Premium', rate: BENCHMARK_RATES.PREMIUM, color: '#475569' },
  ];

  // Data for Cost Breakdown Pie Chart
  const costData = [
    { name: 'Land Cost', value: Number(result.estimatedLandValue || 0), fill: '#2dd4bf' },
    { name: 'Building Cost', value: Number(result.estimatedStructureValue || 0), fill: '#0f766e' },
  ].filter(d => d.value > 0);

  // Sort comparison data so the chart looks orderly
  comparisonData.sort((a, b) => a.rate - b.rate);

  return (
    <div className="space-y-6 mt-8 animate-fade-in-up">
      
      {/* --- NRI & Developer Insights Section --- */}
      {result.nriMetrics && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-lg border border-slate-700">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center text-amber-400">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    NRI & Developer Insights
                </h3>
                <span className="px-3 py-1 bg-slate-700 rounded-full text-xs font-medium text-slate-300 border border-slate-600">
                    Target: American Expats
                </span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Score Card */}
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 flex flex-col items-center justify-center text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">NRI Suitability Score</p>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                            <path className={`${result.nriMetrics.suitabilityScore >= 7 ? 'text-green-500' : result.nriMetrics.suitabilityScore >= 4 ? 'text-yellow-500' : 'text-red-500'}`} 
                                  strokeDasharray={`${result.nriMetrics.suitabilityScore * 10}, 100`} 
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                  fill="none" stroke="currentColor" strokeWidth="4" />
                        </svg>
                        <span className="absolute text-2xl font-bold text-white">{result.nriMetrics.suitabilityScore}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">/ 10</p>
                </div>

                {/* Connectivity */}
                <div className="space-y-3">
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
                         <div className="flex items-center">
                            <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                            <span className="text-sm text-slate-300">Intl Airport (TRV)</span>
                         </div>
                         <span className="font-bold text-white">{result.nriMetrics.airportDist} km</span>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
                         <div className="flex items-center">
                            <svg className="w-4 h-4 text-pink-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            <span className="text-sm text-slate-300">Lulu Mall</span>
                         </div>
                         <span className="font-bold text-white">{result.nriMetrics.mallDist} km</span>
                    </div>
                </div>

                {/* Feasibility */}
                <div className={`p-4 rounded-lg border flex flex-col justify-center ${result.nriMetrics.isVillaFeasible ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Villa Project Feasibility</p>
                    <div className="flex items-center mb-2">
                        {result.nriMetrics.isVillaFeasible ? (
                            <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        ) : (
                            <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        )}
                        <span className={`text-lg font-bold ${result.nriMetrics.isVillaFeasible ? 'text-green-400' : 'text-red-400'}`}>
                            {result.nriMetrics.isVillaFeasible ? "Feasible" : "Not Recommended"}
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-tight">{result.nriMetrics.villaFeasibilityReason}</p>
                </div>

             </div>
        </div>
      )}
        
      {/* Section Header */}
      <div className="flex items-center space-x-2 mb-2 mt-6">
        <div className="p-2 bg-teal-100 rounded-lg">
            <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Local Market Analytics</h3>
      </div>
      
      {/* Metrics Grid */}
      {result.investment && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Est. Rental Yield</p>
                <p className="text-2xl font-bold text-teal-600 mt-1">{result.investment.rentalYield}</p>
                <p className="text-xs text-gray-500 mt-1">Annual Return</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">5-Year Growth</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{result.investment.appreciationForecast}</p>
                <p className="text-xs text-gray-500 mt-1">Appreciation Potential</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Demand Trend</p>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium mt-2
                    ${result.investment.demandTrend === 'High' ? 'bg-green-100 text-green-800' : 
                      result.investment.demandTrend === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {result.investment.demandTrend}
                </div>
                <p className="text-xs text-gray-500 mt-1">{result.investment.marketSentiment}</p>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: Comparative Analysis */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Land Rate Comparison (Lakhs/cent)</h4>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} layout="vertical" margin={{top: 5, right: 30, left: 40, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9"/>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 11, fill: '#64748b'}} />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                            formatter={(val: number) => [`₹${val} Lakhs`, 'Rate/Cent']}
                        />
                        <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={24}>
                            {comparisonData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Compares {localityName} against typical market benchmarks.</p>
        </div>

        {/* CHART 2: Cost Composition */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Total Value Composition</h4>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={costData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {costData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                            formatter={(val: number) => [`₹${val.toFixed(2)} Lakhs`, 'Value']}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Breakdown of Land vs. Structure value.</p>
        </div>
      </div>

    </div>
  );
};

export default InvestmentDashboard;
