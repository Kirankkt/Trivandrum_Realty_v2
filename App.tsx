
import React, { useState } from 'react';
import Header from './components/Header';
import PropertyForm from './components/PropertyForm';
import PriceDisplay from './components/PriceDisplay';
import InvestmentDashboard from './components/InvestmentDashboard';
import GeospatialView from './components/GeospatialView';
import { UserInput, PredictionResult } from './types';
import { predictPrice } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [currentInput, setCurrentInput] = useState<UserInput | null>(null);

  const handlePrediction = async (input: UserInput) => {
    setLoading(true);
    setResult(null); // Clear previous result
    setCurrentInput(input);
    
    try {
      const prediction = await predictPrice(input);
      setResult(prediction);
    } catch (error) {
      console.error(error);
      alert("There was an issue fetching the market data. Please ensure your API Key is valid and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-6xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r mb-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            Enter details below. The AI agent will browse live Google listings for Trivandrum to give you an accurate estimate.
                        </p>
                    </div>
                </div>
            </div>
            <PropertyForm onSubmit={handlePrediction} isLoading={loading} />
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8 space-y-6">
            {loading && (
              <div className="h-96 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-dashed border-gray-300 animate-pulse">
                 <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
                 <p className="text-gray-500 font-medium">Consulting Real Estate Databases...</p>
                 <p className="text-xs text-gray-400 mt-2">Searching for {currentInput?.locality} trends</p>
              </div>
            )}

            {!loading && !result && (
              <div className="h-96 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                <svg className="w-16 h-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-1.447-.894L15 7m0 13V7m0 0L9.553 4.553A1 1 0 008.447 4.553L3 7.236"></path></svg>
                <p className="text-gray-500">Fill the form to get a property estimate.</p>
              </div>
            )}

            {!loading && result && (
              <>
                <PriceDisplay result={result} />
                <InvestmentDashboard 
                    result={result} 
                    localityName={currentInput?.locality || 'Selected Area'}
                />
                <GeospatialView 
                    result={result}
                    locality={currentInput?.locality || ''}
                />
              </>
            )}
          </div>
          
        </div>
      </main>

      <footer className="bg-teal-900 text-teal-300 py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Trivandrum Realty AI. Data provided by Google Search Grounding.</p>
      </footer>
    </div>
  );
};

export default App;
