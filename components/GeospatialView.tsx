
import React from 'react';
import { PredictionResult } from '../types';

interface GeospatialViewProps {
  result: PredictionResult | null;
  locality: string;
}

const GeospatialView: React.FC<GeospatialViewProps> = ({ result, locality }) => {
  if (!result || !result.geoSpatial) return null;

  // Construct Google Maps Embed URL (Satellite View)
  // t=k (Satellite), z=15 (Zoom), q=Locality
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(locality + ", Trivandrum, Kerala")}&t=k&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mt-8 animate-fade-in-up">
      <div className="flex items-center space-x-2 p-6 border-b border-gray-100">
        <div className="p-2 bg-indigo-100 rounded-lg">
            <svg className="w-6 h-6 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Geospatial & Satellite Analysis</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* Map Section */}
        <div className="h-80 lg:h-auto w-full bg-gray-200 relative">
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
           <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 text-xs font-bold rounded shadow">
              Live Satellite View
           </div>
        </div>

        {/* AI Analysis Section */}
        <div className="p-6 bg-gray-50 space-y-6">
            
            {/* Terrain & Vibe */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Terrain Type</p>
                    <p className="font-semibold text-indigo-900">{result.geoSpatial.terrain}</p>
                    <p className="text-xs text-gray-500 mt-1">Affects construction cost</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Neighborhood Vibe</p>
                    <p className="font-semibold text-indigo-900">{result.geoSpatial.neighborhoodVibe}</p>
                    <p className="text-xs text-gray-500 mt-1">Lifestyle indicator</p>
                </div>
            </div>

            {/* Price Gradient */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    <p className="text-sm font-bold text-gray-700">Price Trends & Gradients</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {result.geoSpatial.priceGradient}
                </p>
            </div>

            {/* Growth Drivers */}
            <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-2">Key Growth Drivers</p>
                <div className="flex flex-wrap gap-2">
                    {result.geoSpatial.growthDrivers.map((driver, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full border border-indigo-200">
                            {driver}
                        </span>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default GeospatialView;
