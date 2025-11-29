import React, { useEffect, useState } from 'react';
import { APP_TITLE, APP_DESC } from '../constants';
import { supabase } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';
const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for the login link!');
      setShowLogin(false);
    }
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  return (
    <header className="glass-dark sticky top-0 z-50 shadow-xl animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Brand */}
          <div className="flex-shrink-0 animate-fade-in">
            <h1 className="heading-display text-3xl font-bold tracking-tight text-white">
              {APP_TITLE}
            </h1>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <a href="#how-it-works" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              Pricing
            </a>
            <a href="#resources" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              Resources
            </a>
            <a href="#contact" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              Contact
            </a>
          </nav>

          {/* Right: Live Badge + Auth */}
          <div className="flex items-center space-x-4 animate-slide-right">
            {/* Live Market Badge */}
            <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm py-2 px-3 rounded-full text-xs font-semibold border border-emerald-400/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-lg"></span>
              </span>
              <span className="text-emerald-100">Live Data</span>
            </div>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white/30 hover-scale transition-all">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all border border-white/20 hover:border-white/40 backdrop-blur-sm hover-lift"
                >
                  Sign Out
                </button>
              </div>
            ) : showLogin ? (
              <form onSubmit={handleLogin} className="flex items-center space-x-2 animate-scale-in">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="text-gray-800 text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-md"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="gradient-accent text-white text-sm font-bold py-2 px-4 rounded-lg transition-all shadow-lg hover-lift disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="gradient-gold text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-all shadow-xl hover-lift"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
