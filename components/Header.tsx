import React from 'react';
import { useAuth } from './AuthProvider';

const Header: React.FC = () => {
  const { user, loading, signIn, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Left: Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#estimate-form" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Get Estimate
            </a>
            <a href="#featured" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Examples
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              How It Works
            </a>
          </nav>

          {/* Center: Logo */}
          <div className="flex-1 md:flex-none flex justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">FairRate</span>
              <span className="text-2xl font-light text-gray-700 ml-1">Kerala</span>
            </a>
          </div>

          {/* Right: Auth */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : user ? (
              <>
                <span className="text-sm text-gray-700 hidden sm:inline">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={signIn}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
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
