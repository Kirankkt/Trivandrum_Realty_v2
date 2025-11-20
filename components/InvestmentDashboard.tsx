
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

  const comparisonData = [
    { name: 'Suburbs', rate: BENCHMARK_RATES.SUBURB, color: '#94a3b8' },
    { name: 'City Avg', rate: BENCHMARK_RATES.CITY_AVG, color: '#cbd5e1' },
    { name: localityName, rate: landRate, color: '#0d9488' },
    { name: 'Tech Hub', rate: BENCHMARK_RATES.TECH_HUB, color: '#64748b' },
    { name: 'Premium', rate: BENCHMARK_RATES.PREMIUM, color: '#475569' },
  ];

  const costData = [
    { name: 'Land Cost', value: Number(result.estimatedLandValue || 0), fill: '#2dd4bf' },
    { name: 'Building Cost', value: Number(result.estimatedStructureValue || 0), fill: '#0f766e' },
  ].filter(d => d.value > 0);

  comparisonData.sort((a, b) => a.rate - b.rate);

  return (
    <div className="space-y-6 mt-8 animate-fade-in-up">
      
      {/* Section Header */}
      <div className="flex items-center space-x-2 mb-2">
        <div className="p-2 bg-teal-100 rounded-lg">
            <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Financial Analytics</h3>
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
        </div>

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
        </div>
      </div>
    </div>
  );
};

export default InvestmentDashboard;
