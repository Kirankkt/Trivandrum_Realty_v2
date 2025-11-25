import React, { useState } from 'react';
import { PredictionResult } from '../types';
interface PriceDisplayProps {
  result: PredictionResult | null;
}
const PriceDisplay: React.FC<PriceDisplayProps> = ({ result }) => {
  const [showSources, setShowSources] = useState(false);
  if (!result) return null;
  const formatCurrency = (value: number) => {
    const val = Number(value); // Safety cast
    if (val >= 100) {
      return (val / 100).toFixed(2);
    }
    return val.toFixed(2);
  };
  const getUnit = (value: number) => {
    return Number(value) >= 100 ? "Cr" : "Lakhs";
  };
  const renderPriceRange = () => {
    const minUnit = getUnit(result.minPrice);
    const maxUnit = getUnit(result.maxPrice);
    if (minUnit === 'Cr' && maxUnit === 'Cr') {
      return (
        <>
          ₹{formatCurrency(result.minPrice)} - {formatCurrency(result.maxPrice)} <span className="text-2xl font-normal">Cr</span>
        </>
      );
    }
    if (minUnit === 'Lakhs' && maxUnit === 'Lakhs') {
      return (
        <>
          ₹{formatCurrency(result.minPrice)} - {formatCurrency(result.maxPrice)} <span className="text-2xl font-normal">Lakhs</span>
        </>
      );
    }
    return (
      <>
        ₹{formatCurrency(result.minPrice)} <span className="text-2xl font-normal">Lakhs</span> - {formatCurrency(result.maxPrice)} <span className="text-2xl font-normal">Cr</span>
      </>
    );
  };
  return (
    <div className="bg-white rounded-xl shadow-lg border border-teal-100 overflow-hidden animate-fade-in-up">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-8 text-white text-center">
        <h3 className="text-lg font-medium opacity-90 mb-2">Estimated Market Value</h3>
        <div className="text-5xl font-bold tracking-tight">
          {renderPriceRange()}
        </div>
        <p className="mt-2 opacity-80 text-sm">Based on current listings in {new Date().getFullYear()}</p>
      </div>
      <div className="p-6">
        {/* Calculation Breakdown Table */}
        {result.breakdown && (
          <div className="mb-6 bg-gray-50 rounded-lg border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center text-sm uppercase tracking-wide">
              <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
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
              {Number(result.estimatedStructureValue) > 0 && (
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
    </div>
  );
};
export default PriceDisplay;
