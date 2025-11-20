
import React from 'react';
import { PredictionResult } from '../types';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

interface GeospatialViewProps {
  result: PredictionResult | null;
  locality: string;
}

const GeospatialView: React.FC<GeospatialViewProps> = ({ result, locality }) => {
  if (!result || !result.geoSpatial) return null;

  const { geoSpatial } = result;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(locality + ", Trivandrum, Kerala")}&t=k&z=15&ie=UTF8&iwloc=&output=embed`;

  // Colors for scatter plot
  const COLORS: Record<string, string> = {
      'Premium': '#0d9488', // Teal
      'Mid-Range': '#64748b', // Slate
      'Budget': '#f59e0b', // Amber
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
        
      {/* 1. Live Map Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
                <h3 className="text-xl font-bold text-gray-800">Satellite Surveillance</h3>
                <p className="text-sm text-gray-500">Live terrain view of {locality}</p>
            </div>
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold">
                {geoSpatial.terrain}
            </div>
          </div>
          <div className="h-80 w-full bg-gray-200 relative">
            <iframe 
                width="100%" 
                height="100%" 
                src={mapSrc} 
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0}
                title="Satellite View"
                className="absolute inset-0"
            ></iframe>
          </div>
      </div>

      {/* 2. Price Clustering Analysis (Scatter Plot) */}
      {geoSpatial.marketDepth && geoSpatial.marketDepth.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Market Depth & Clustering</h3>
            <p className="text-sm text-gray-500 mb-6">
                How properties cluster by Price vs. Size in {locality}.
            </p>
            
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                            type="number" 
                            dataKey="size" 
                            name="Size" 
                            unit={result.estimatedStructureValue ? " sqft" : " cents"} 
                            label={{ value: 'Plot Size', position: 'insideBottomRight', offset: -10 }}
                        />
                        <YAxis 
                            type="number" 
                            dataKey="price" 
                            name="Price" 
                            unit="L" 
                            label={{ value: 'Price (Lakhs)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
                                            <p className="font-bold text-gray-800">{data.type}</p>
                                            <p className="text-sm">Size: {data.size}</p>
                                            <p className="text-sm">Est: ₹{data.price} Lakhs</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend />
                        <Scatter name="Comparable Listings" data={geoSpatial.marketDepth} fill="#8884d8">
                            {geoSpatial.marketDepth.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.type] || '#8884d8'} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center space-x-6 text-xs">
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-teal-600 mr-2"></span> Premium</div>
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-slate-500 mr-2"></span> Mid-Range</div>
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span> Budget</div>
            </div>
          </div>
      )}

      {/* 3. Micro-Markets & Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
             <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Micro-Market Zones
             </h4>
             <div className="space-y-3">
                {geoSpatial.microMarkets && geoSpatial.microMarkets.map((zone, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-gray-700">{zone.name}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                zone.priceLevel.includes('High') ? 'bg-red-100 text-red-700' :
                                zone.priceLevel.includes('Med') ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                            }`}>{zone.priceLevel}</span>
                        </div>
                        <p className="text-xs text-gray-500">{zone.description}</p>
                    </div>
                ))}
                {!geoSpatial.microMarkets && <p className="text-sm text-gray-400 italic">No micro-market data available.</p>}
             </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h4 className="font-bold text-gray-800 mb-4">Neighborhood Vibe</h4>
              <p className="text-gray-600 leading-relaxed text-sm mb-4">
                  {geoSpatial.neighborhoodVibe}
              </p>
              <h4 className="font-bold text-gray-800 mb-2 text-sm">Key Growth Drivers</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {geoSpatial.growthDrivers.map((driver, idx) => (
                      <li key={idx}>{driver}</li>
                  ))}
              </ul>
          </div>
      </div>
    </div>
  );
};

export default GeospatialView;

