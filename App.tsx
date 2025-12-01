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
import { FeaturedProperties } from './components/FeaturedProperties';
import { UserInput, PredictionResult } from './types';
import { predictPrice } from './services/geminiService';
import { TrendingUp, Shield, Database } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [currentInput, setCurrentInput] = useState<UserInput | null>(null);
  const [activeTab, setActiveTab] = useState<'valuation' | 'nri' | 'geospatial' | 'historical' | 'trends' | 'mysaved'>('valuation');
  const [showForm, setShowForm] = useState(false);

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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        {/* Zillow-Style Hero Section */}
        <section
          className="relative h-[500px] bg-cover bg-center flex items-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1920&q=80)',
            backgroundPosition: 'center center'
          }}
        >
          {/* Lighter Overlay for Natural Look */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/50 to-transparent"></div>

          {/* Hero Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Don't Overpay for
                <br />
                Kerala Real Estate
              </h1>
              <p className="text-xl text-white/95 mb-6">
                Get AI-verified price estimates in 60 seconds.
              </p>
              <ul className="text-lg text-white/90 mb-8 space-y-2">
                <li className="flex items-center gap-2">
                  <span>✓</span> Know if you're getting a fair deal
                </li>
                <li className="flex items-center gap-2">
                  <span>⚠️</span> Avoid overpaying by 5-10%
                </li>
              </ul>

              <button
                onClick={() => {
                  setShowForm(true);
                  document.getElementById('estimate-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Verify Price Free →
              </button>
            </div>
          </div>
        </section>

        {/* Trust Indicators Bar */}
        <section className="bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="bg-orange-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">37%</div>
                  <div className="text-sm text-gray-600">Properties Overpriced</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">87%</div>
                  <div className="text-sm text-gray-600">Price Accuracy</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">15+</div>
                  <div className="text-sm text-gray-600">Verified Localities</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties Section */}
        <FeaturedProperties />

        {/* Estimate Form Section */}
        <section id="estimate-form" className="bg-gray-50 py-12">
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
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
                    <svg className="w-16 h-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 01-1.447-.894L15 7m0 13V7m0 0L9.553 4.553A1 1 0 008.447 4.553L3 7.236"></path></svg>
                    <p className="text-gray-500 mb-4">Fill the form to get a property estimate.</p>
                    <button
                      onClick={() => setActiveTab('mysaved')}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                      </svg>
                      Or view your Dashboard
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
                        Dashboard
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
        </section>
        <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Trivandrum Realty. Data provided by Google Search Grounding.</p>
        </footer>
      </div>
    </AuthProvider>
  );
};
export default App;
