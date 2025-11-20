
import React, { useState } from 'react';
import Header from './components/Header';
import PropertyForm from './components/PropertyForm';
import PriceDisplay from './components/PriceDisplay';
import InvestmentDashboard from './components/InvestmentDashboard';
import GeospatialView from './components/GeospatialView';
import NriView from './components/NriView';
import { UserInput, PredictionResult } from './types';
import { predictPrice } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [currentInput, setCurrentInput] = useState<UserInput | null>(null);
  const [activeTab, setActiveTab] = useState<'valuation' | 'nri' | 'geo'>('valuation');

  const handlePrediction = async (input: UserInput) => {
    setLoading(true);
    setResult(null);
    setCurrentInput(input);
    // Reset to valuation tab on new search
    setActiveTab('valuation');
    
    try {
      const prediction = await predictPrice(input);
      setResult(prediction);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message || "There was an issue fetching the market data.";
      alert(`Error: ${errorMessage}\n\nPlease check your API Key configuration in Netlify.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-6xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form (Always Visible) */}
          <div className="lg:col-span-4 space-y-6">
            <PropertyForm onSubmit={handlePrediction} isLoading={loading} />
          </div>

          {/* Right Column: Results & Tabs */}
          <div className="lg:col-span-8 space-y-6">
            
            {loading && (
              <div className="h-96 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-dashed border-gray-300 animate-pulse">
                 <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
                 <p className="text-gray-500 font-medium">Analyzing Market Data...</p>
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
                {/* Navigation Tabs */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4">
                    <button 
                        onClick={() => setActiveTab('valuation')}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === 'valuation' ? 'bg-white text-teal-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Valuation
                    </button>
                    <button 
                        onClick={() => setActiveTab('nri')}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === 'nri' ? 'bg-white text-teal-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        NRI Insights
                    </button>
                    <button 
                        onClick={() => setActiveTab('geo')}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === 'geo' ? 'bg-white text-teal-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Geospatial
                    </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[500px]">
                    {activeTab === 'valuation' && (
                        <>
                            <PriceDisplay result={result} />
                            <InvestmentDashboard 
                                result={result} 
                                localityName={currentInput?.locality || 'Selected Area'}
                            />
                        </>
                    )}
                    
                    {activeTab === 'nri' && (
                        <NriView result={result} />
                    )}

                    {activeTab === 'geo' && (
                        <GeospatialView 
                            result={result} 
                            locality={currentInput?.locality || ''} 
                        />
                    )}
                </div>
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


