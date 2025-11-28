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
    <header className="bg-teal-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-3xl font-bold tracking-tight">{APP_TITLE}</h1>
          <p className="text-teal-200 mt-1 text-sm">{APP_DESC}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-teal-900/50 py-2 px-4 rounded-full text-xs font-medium border border-teal-600 backdrop-blur-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span>Live Market Data</span>
          </div>
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-teal-100 hidden sm:inline">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold py-2 px-4 rounded transition-colors border border-teal-600"
              >
                Sign Out
              </button>
            </div>
          ) : showLogin ? (
            <form onSubmit={handleLogin} className="flex items-center space-x-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="text-gray-800 text-xs px-2 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1.5 px-3 rounded transition-colors"
              >
                {loading ? 'Sending...' : 'Send Link'}
              </button>
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="text-teal-200 hover:text-white text-xs"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-white text-teal-800 hover:bg-teal-50 text-xs font-bold py-2 px-4 rounded transition-colors shadow-sm"
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
