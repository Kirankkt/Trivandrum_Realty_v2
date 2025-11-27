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
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
        Property Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Selection */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Asset Type</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType(PropertyType.PROPERTY)}
              className={`py-2 px-4 text-sm font-medium rounded-lg border ${type === PropertyType.PROPERTY
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                } transition-colors`}
            >
              🏠 House / Villa
            </button>
            <button
              type="button"
              onClick={() => setType(PropertyType.PLOT)}
              className={`py-2 px-4 text-sm font-medium rounded-lg border ${type === PropertyType.PLOT
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                } transition-colors`}
            >
              📍 Plot / Land
            </button>
          </div>
        </div>
        {/* Locality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Locality</label>
          <select
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-3 bg-gray-50 border"
          >
            {LOCALITIES.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        {/* Distance to Beach */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Distance to Beach
              {isAutoSet && <span className="ml-2 text-xs text-teal-600 font-normal bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">Auto-set for {locality}</span>}
            </label>
            <span className="text-sm font-semibold text-teal-700">{distance} km</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="15"
            step="0.1"
            value={distance}
            onChange={(e) => handleDistanceChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Beachfront (Nearest Coast)</span>
            <span>Inland</span>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Dimensions & Features</label>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Land Area - Always Visible */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plot Area <span className="text-gray-400 font-normal">(cents)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={plotArea}
                onChange={(e) => setPlotArea(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-3 border bg-gray-50"
                required
              />
              {type === PropertyType.PLOT && Number(plotArea) < 5 && (
                <p className="text-xs text-amber-600 mt-1">Tip: &gt; 5 cents recommended for Villas.</p>
              )}
            </div>
            {/* Built Area - Conditional */}
            {type === PropertyType.PROPERTY && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Built-up Area <span className="text-gray-400 font-normal">(sq ft)</span>
                </label>
                <input
                  type="number"
                  value={builtArea}
                  onChange={(e) => setBuiltArea(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-3 border bg-gray-50"
                  required
                />
              </div>
            )}
          </div>
          {type === PropertyType.PROPERTY && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-3 border bg-gray-50"
                >
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} BHK</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Age</label>
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-3 border bg-gray-50"
                >
                  <option>Brand New / Under Construction</option>
                  <option>Resale (&lt; 10 Years)</option>
                  <option>Old (&gt; 10 Years)</option>
                </select>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Road Access</label>
            <select
              value={roadWidth}
              onChange={(e) => setRoadWidth(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-3 border bg-gray-50"
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
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
        >
          {isLoading ? 'Analyzing...' : 'Get Precise Estimate'}
        </button>
      </form>
    </div>
  );
};
export default PropertyForm;
