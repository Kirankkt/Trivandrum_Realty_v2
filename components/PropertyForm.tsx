import React, { useState, useEffect } from 'react';
import { UserInput, PropertyType } from '../types';
import { LOCALITIES, LOCALITY_META } from '../constants';
interface PropertyFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}
const PropertyForm: React.FC<PropertyFormProps> = ({ onSubmit, isLoading }) => {
  const [type, setType] = useState<PropertyType>(PropertyType.PROPERTY);
  const [locality, setLocality] = useState(LOCALITIES.sort().find(l => l === 'Kowdiar') || LOCALITIES[0]);
  const [distance, setDistance] = useState<number>(7.5);
  const [isAutoSet, setIsAutoSet] = useState<boolean>(true);
  // Inputs
  const [plotArea, setPlotArea] = useState<string>('5'); // Cents
  const [builtArea, setBuiltArea] = useState<string>('1500'); // Sq ft
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [age, setAge] = useState<string>('Resale (< 10 Years)');
  const [roadWidth, setRoadWidth] = useState<string>('Car Access');
  // Adjust defaults when switching types
  useEffect(() => {
    if (type === PropertyType.PLOT) {
      setPlotArea('10');
    } else {
      setPlotArea('5');
      setBuiltArea('1500');
    }
  }, [type]);
  // Auto-calibrate distance when locality changes
  useEffect(() => {
    const defaultDist = LOCALITY_META[locality];
    if (defaultDist !== undefined) {
      setDistance(defaultDist);
      setIsAutoSet(true);
    }
  }, [locality]);
  const handleDistanceChange = (val: number) => {
    setDistance(val);
    setIsAutoSet(false);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      locality,
      distanceToBeach: distance,
      plotArea: Number(plotArea),
      builtArea: type === PropertyType.PROPERTY ? Number(builtArea) : undefined,
      bedrooms: type === PropertyType.PROPERTY ? bedrooms : undefined,
      propertyAge: type === PropertyType.PROPERTY ? age : undefined,
      roadWidth
    });
  };
  return (
    <div className="glass-dark rounded-2xl p-8 border-2 border-white/10 shadow-depth card-3d">
      <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
        <svg className="w-6 h-6 mr-3 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
        Property Details
      </h2>
      <p className="text-sm text-white/70 mb-6">Tell us about your property</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Selection */}
        <div>
          <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">Asset Type</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType(PropertyType.PROPERTY)}
              className={`py-2 px-4 text-sm font-medium rounded-lg border ${type === PropertyType.PROPERTY
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-white/90 border-gray-300 hover:bg-gray-50'
                } transition-colors`}
            >
              🏠 House / Villa
            </button>
            <button
              type="button"
              onClick={() => setType(PropertyType.PLOT)}
              className={`py-2 px-4 text-sm font-medium rounded-lg border ${type === PropertyType.PLOT
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-white/90 border-gray-300 hover:bg-gray-50'
                } transition-colors`}>
              📍 Plot / Land
            </button>
          </div>
        </div>
        {/* Locality */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">Locality</label>
          <select
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-gray-50 border"
          >
            {LOCALITIES.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        {/* Distance to Beach */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-white/90">Distance to Beach</label>
            <div className="flex items-center gap-2">
              {isAutoSet && <span className="text-xs text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded border border-teal-400/20">Auto: {locality}</span>}
              <span className="text-sm font-bold text-teal-400">{distance} km</span>
            </div>
          </div>
          <input
            type="range"
            min="0.1"
            max="15"
            step="0.1"
            value={distance}
            onChange={(e) => handleDistanceChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500"
          />
          <div className="flex justify-between text-xs text-white/50 mt-2">
            <span>Beachfront</span>
            <span>Inland</span>
          </div>
        </div>
        <div className="border-t border-white/10 pt-5 mt-5">
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Dimensions & Features</label>
          <div className="grid grid-cols-2 gap-4">
            {/* Plot Area - Always Visible */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Plot Area <span className="text-white/50 text-xs">(cents)</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={plotArea}
                onChange={(e) => setPlotArea(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 text-white placeholder-white/30 shadow-sm"
                placeholder="e.g., 5"
                required
              />
            </div>
            {/* Built Area - Conditional */}
            {type === PropertyType.PROPERTY && (
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Built-up <span className="text-white/50 text-xs">(sq ft)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={builtArea}
                  onChange={(e) => setBuiltArea(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 text-white placeholder-white/30 shadow-sm"
                  placeholder="e.g., 1500"
                  required
                />
              </div>
            )}
          </div>
          {type === PropertyType.PROPERTY && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Bedrooms</label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-white shadow-sm"
                >
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} BHK</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Property Age</label>
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-white shadow-sm"
                >
                  <option>Brand New / Under Construction</option>
                  <option>Resale (&lt; 10 Years)</option>
                  <option>Old (&gt; 10 Years)</option>
                </select>
              </div>
            </div>
          )}
          <div className="mt-4">
            <label className="block text-sm font-medium text-white/90 mb-2">Road Access</label>
            <select
              value={roadWidth}
              onChange={(e) => setRoadWidth(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-white shadow-sm"
            >
              <option>Wide / Lorry Access</option>
              <option>Car Access</option>
              <option>Narrow / Bike Only</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3.5 px-6 mt-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-semibold rounded-lg shadow-lg shadow-teal-500/30 transition-all hover:shadow-xl hover:shadow-teal-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : 'Get Precise Estimate'}
        </button>
      </form >
    </div >
  );
};
export default PropertyForm;
