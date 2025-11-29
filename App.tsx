import React, { useState } from 'react';
import { AuthProvider } from './components/AuthProvider';
import Header from './components/Header';
import PropertyForm from './components/PropertyForm';
import PriceDisplay from './components/PriceDisplay';
import HistoricalModels from './components/HistoricalModels';
import GeospatialView from './components/GeospatialView';
import TopLocations from './components/TopLocations';
import NriView from './components/NriView';
import LoadingProgress from './components/LoadingProgress';
import MySavedListings from './components/MySavedListings';
import { UserInput, PredictionResult } from './types';
import { predictPrice } from './services/geminiService';
const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [currentInput, setCurrentInput] = useState<UserInput | null>(null);
  const [activeTab, setActiveTab] = useState<'valuation' | 'nri' | 'geospatial' | 'historical' | 'trends' | 'mysaved'>('valuation');
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
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />

        {/* Vibrant Hero Section */}
        <section className="hero-dark mesh-gradient py-16 relative overflow-hidden">
          {/* Floating Shapes */}
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
          <div className="hero-shape hero-shape-3"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <div className="text-center py-12 animate-fade-in-up">
              <h2 className="text-huge text-white mb-6 leading-tight">
                AI-Powered Property
                <br />
                <span className="gradient-text font-bold">Valuation for NRIs</span>
              </h2>
              <p className="text-subtitle text-white/80 max-w-2xl mx-auto mb-8">
                Get instant, data-driven property estimates for Trivandrum.
                Transparent pricing, NRI-focused insights, and expert recommendations.
              </p>
            </div>
          </div>
        </section>

        <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-6xl -mt-16 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form (Always Visible) */}
            <div className="lg:col-span-4 space-y-6 animate-slide-left">
              <PropertyForm onSubmit={handlePrediction} isLoading={loading} />
            </div>
            {/* Right Column: Results & Tabs */}
            <div className="lg:col-span-8 space-y-6 animate-slide-right">
              <LoadingProgress isLoading={loading} />
              {!loading && !result && activeTab !== 'mysaved' && (
                <div className="h-96 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                  <svg className="w-16 h-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-1.447-.894L15 7m0 13V7m0 0L9.553 4.553A1 1 0 008.447 4.553L3 7.236"></path></svg>
                  <p className="text-gray-500 mb-4">Fill the form to get a property estimate.</p>
                  <button
                    onClick={() => setActiveTab('mysaved')}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                    </svg>
                    Or view My Saved Estimates
                  </button>
                </div>
              )}
              {!loading && activeTab === 'mysaved' && !result && (
                <MySavedListings />
              )}
              {!loading && result && (
                <>
                  {/* Navigation Tabs */}
                  <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4 overflow-x-auto">
                    <button
                      onClick={() => setActiveTab('valuation')}
                      className={`flex-1 min-w-[100px] py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === 'valuation' ? 'bg-white text-blue-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}>
                      Valuation
                    </button>
                    <button
                      onClick={() => setActiveTab('nri')}
                      className={`flex-1 min-w-[100px] py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === 'nri' ? 'bg-white text-blue-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}>
                      NRI Insights
                    </button>
                    <button
                      onClick={() => setActiveTab('geospatial')}
                      className={`flex-1 min-w-[100px] py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === 'geospatial' ? 'bg-white text-blue-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}>
                      Geospatial
                    </button>
                    <button
                      onClick={() => setActiveTab('trends')}
                      className={`flex-1 min-w-[100px] py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === 'trends' ? 'bg-white text-blue-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}>
                      Market Trends
                    </button>
                    <button
                      onClick={() => setActiveTab('historical')}
                      className={`flex-1 min-w-[100px] py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === 'historical' ? 'bg-white text-blue-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}>
                      Analytics
                    </button>
                    <button
                      onClick={() => setActiveTab('mysaved')}
                      className={`flex-1 min-w-[100px] py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === 'mysaved' ? 'bg-white text-blue-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}>
                      My Saved
                    </button>
                  </div>
                  {/* Tab Content */}
                  <div className="min-h-[500px]">
                    {activeTab === 'valuation' && (
                      <PriceDisplay result={result} input={currentInput} />
                    )}
                    {activeTab === 'nri' && (
                      <NriView result={result} />
                    )}
                    {activeTab === 'trends' && (
                      <TopLocations />
                    )}
                    {activeTab === 'geospatial' && (
                      <GeospatialView
                        result={result}
                        locality={currentInput?.locality || ''}
                      />
                    )}
                    {activeTab === 'historical' && (
                      <HistoricalModels result={result} />
                    )}
                    {activeTab === 'mysaved' && (
                      <MySavedListings />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
        <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Trivandrum Realty. Data provided by Google Search Grounding.</p>
        </footer>
      </div>
    </AuthProvider>
  );
};
export default App;
