import React, { useState, useEffect } from 'react';
import { PredictionResult } from '../types';
import { supabase } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';
interface PriceDisplayProps {
  result: PredictionResult | null;
}
const PriceDisplay: React.FC<PriceDisplayProps> = ({ result }) => {
  const [showSources, setShowSources] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);
  if (!result) return null;
  const handleSave = async () => {
    if (!user) {
      alert("Please Sign In to save estimates!");
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase.from('saved_estimates').insert({
        user_id: user.id,
        locality: 'Trivandrum', // Ideally passed as prop
        property_type: 'Property', // Defaulting
        estimated_price: `${result.minPrice}-${result.maxPrice} Lakhs`
      });
      if (error) throw error;
      setSaveStatus('saved');
    } catch (err) {
      console.error('Error saving:', err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };
  const formatPrice = (price: number) => {
    if (price >= 100) {
      return `₹${(price / 100).toFixed(2)} Cr`;
    }
    return `₹${price} Lakhs`;
  };
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-teal-100 transform transition-all hover:scale-[1.01]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Estimated Total Value</h3>
          <div className="flex items-baseline mt-1">
            <span className="text-4xl font-extrabold text-teal-700">
              {formatPrice(result.minPrice)} - {formatPrice(result.maxPrice)}
            </span>
          </div>
        </div>
        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving || saveStatus === 'saved'}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${saveStatus === 'saved'
              ? 'bg-green-100 text-green-700 cursor-default'
              : 'bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-600'
            }`}
        >
          {saveStatus === 'saved' ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span>Saved</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill={saveStatus === 'error' ? 'none' : 'currentColor'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </>
          )}
        </button>
      </div>
      {/* Breakdown */}
      {result.breakdown && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
          <h4 className="font-semibold text-gray-700 mb-3 text-xs uppercase tracking-wide flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            Valuation Math
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 border-dashed">
              <span className="text-gray-600">Land Rate Found:</span>
              <span className="font-medium text-gray-900">₹{Number(result.breakdown.landRatePerCent || 0)} Lakhs / cent</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 border-dashed">
              <span className="text-gray-600">Land Value (Total):</span>
              <span className="font-medium text-teal-700">₹{Number(result.breakdown.landTotal || 0).toFixed(2)} Lakhs</span>
            </div>
            {Number(result.breakdown.finalStructureValue) > 0 && (
              <>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 border-dashed">
                  <span className="text-gray-600">Construction Rate:</span>
                  <span className="font-medium text-gray-900">₹{Number(result.breakdown.structureRatePerSqFt || 0)} / sq ft</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 border-dashed">
                  <span className="text-gray-600">Depreciation (Age):</span>
                  <span className="font-medium text-red-500">-{Number(result.breakdown.depreciationPercentage || 0)}%</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 border-dashed">
                  <span className="text-gray-600">Structure Value:</span>
                  <span className="font-medium text-teal-700">₹{Number(result.breakdown.finalStructureValue || 0).toFixed(2)} Lakhs</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-600">Road Access Adj:</span>
              <span className={`font-bold ${result.breakdown.roadAccessAdjustment.includes('+') ? 'text-green-600' : 'text-gray-500'}`}>
                {result.breakdown.roadAccessAdjustment}
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">AI Analysis</h4>
        <p className="text-gray-600 leading-relaxed text-sm">{result.explanation}</p>
      </div>
      <div className="mb-6 bg-teal-50 rounded-lg p-4 border border-teal-100">
        <h4 className="font-semibold text-teal-800 mb-1">Recommendation</h4>
        <p className="text-teal-700 text-sm italic">"{result.recommendation}"</p>
      </div>
      {result.sources.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowSources(!showSources)}
            className="flex items-center justify-between w-full text-left text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 hover:text-teal-600 transition-colors"
          >
            <span>Market Data Sources ({result.sources.length})</span>
            <svg
              className={`w-4 h-4 transition-transform ${showSources ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {showSources && (
            <ul className="space-y-2">
              {result.sources.map((source, idx) => (
                <li key={idx} className="text-sm truncate">
                  <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline flex items-center">
                    <svg className="w-3 h-3 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
export default PriceDisplay;
