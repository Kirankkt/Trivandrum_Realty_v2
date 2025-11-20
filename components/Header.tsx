import React from 'react';
import { APP_TITLE, APP_DESC } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="bg-teal-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-3xl font-bold tracking-tight">{APP_TITLE}</h1>
          <p className="text-teal-200 mt-1 text-sm">{APP_DESC}</p>
        </div>
        <div className="flex items-center space-x-2 bg-teal-900/50 py-2 px-4 rounded-full text-xs font-medium border border-teal-600 backdrop-blur-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span>Live Market Data</span>
        </div>
      </div>
    </header>
  );
};

export default Header;