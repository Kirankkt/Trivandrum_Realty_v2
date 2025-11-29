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
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0 animate-fade-in">
          <h1 className="heading-display text-4xl font-bold tracking-tight text-white mb-2">
            {APP_TITLE}
          </h1>
          <p className="text-slate-300 mt-1 text-sm max-w-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {APP_DESC}
          </p>
        </div>

        <div className="flex items-center space-x-4 animate-slide-right">
          {/* Live Market Badge */}
          <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm py-2.5 px-4 rounded-full text-xs font-semibold border border-emerald-400/30 hover-glow transition-all">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-lg"></span>
            </span>
            <span className="text-emerald-100">Live Market Data</span>
          </div>

          {/* Auth Section */}
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white/30 hover-scale transition-all">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2.5 px-5 rounded-lg transition-all border border-white/20 hover:border-white/40 backdrop-blur-sm hover-lift"
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
                className="text-gray-800 text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-md"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="gradient-accent text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-all shadow-lg hover-lift disabled:opacity-50"
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
              className="gradient-gold text-white text-sm font-bold py-3 px-6 rounded-lg transition-all shadow-xl hover-lift"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
