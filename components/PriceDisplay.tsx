import React, { useState, useEffect } from 'react';
import { PredictionResult, UserInput, PropertyType } from '../types';
import { supabase } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';
import { formatCurrency } from '../utils/formatters';
import LeadCaptureModal from './LeadCaptureModal';

interface PriceDisplayProps {
  result: PredictionResult | null;
  input: UserInput | null;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ result, input }) => {
  const [showSources, setShowSources] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [showLeadModal, setShowLeadModal] = useState(false);

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
      // Format property details string for display
      let propertyDetails = '';
      if (input?.type === PropertyType.PROPERTY && input?.bedrooms) {
        propertyDetails = `${input.bedrooms} | ${input.builtArea} sqft`;
      } else if (input?.plotArea) {
        propertyDetails = `${input.plotArea} cents`;
      }

      // Format price with formatCurrency utility
      const formattedMin = formatCurrency(result.minPrice);
      const formattedMax = formatCurrency(result.maxPrice);

      const { error } = await supabase.from('saved_estimates').insert({
        user_id: user.id,
        locality: input?.locality || 'Trivandrum',
        property_type: input?.type || 'Property',
        land_area_cents: input?.plotArea || null,
        built_area_sqft: input?.builtArea || null,
        bedrooms: input?.bedrooms ? `${input.bedrooms} BHK` : null,
        estimated_price: `${formattedMin}-${formattedMax}`
      });

      if (error) throw error;
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000); // Reset after 3s
    } catch (err) {
      console.error('Error saving:', err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="glass-premium rounded-2xl shadow-depth p-8 mb-8 border-2 border-pink-500/30 card-3d">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-white/60 font-semibold text-sm uppercase tracking-wider mb-2">Estimated Total Value</h3>
          <div className="flex items-baseline mt-1">
            <span className="text-5xl font-extrabold gradient-text">
              {result.minPrice >= 100 ? `₹${(result.minPrice / 100).toFixed(2)} Cr` : `₹${result.minPrice} Lakhs`}
              -
              {result.maxPrice >= 100 ? `₹${(result.maxPrice / 100).toFixed(2)} Cr` : `₹${result.maxPrice} Lakhs`}
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

      {/* Contact Agent Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowLeadModal(true)}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <span className="text-lg">Contact Verified Agent</span>
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">Get expert guidance for buying or selling in {input?.locality}</p>
      </div>

      {/* Confidence Badge */}
      {result.confidence && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < (result.confidence.level === 'High' ? 3 : result.confidence.level === 'Medium' ? 2 : 1) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Confidence: {result.confidence.level}
                </p>
                <p className="text-xs text-gray-600">
                  {result.confidence.sampleSize} source{result.confidence.sampleSize !== 1 ? 's' : ''}
                  {result.confidence.lastUpdated && result.confidence.lastUpdated !== 'Unknown' &&
                    ` • Last updated: ${new Date(result.confidence.lastUpdated).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{result.confidence.score}%</p>
            </div>
          </div>
          {result.confidence.level === 'Low' && (
            <p className="mt-2 text-xs text-blue-700 bg-blue-100/50 rounded px-2 py-1">
              ℹ️ Limited data for this area - estimate will improve as more searches are conducted
            </p>
          )}
        </div>
      )}

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

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        locality={input?.locality || 'Trivandrum'}
      />
    </div>
  );
};


export default PriceDisplay;
