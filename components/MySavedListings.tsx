import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthProvider';

interface SavedEstimate {
    id: number;
    locality: string;
    property_type: string;
    estimated_price: string;
    created_at: string;
}

const MySavedListings: React.FC = () => {
    const { user } = useAuth();
    const [savedListings, setSavedListings] = useState<SavedEstimate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchSavedListings();
        }
    }, [user]);

    const fetchSavedListings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('saved_estimates')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSavedListings(data || []);
        } catch (error) {
            console.error('Error fetching saved listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this saved estimate?')) return;

        try {
            const { error } = await supabase
                .from('saved_estimates')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Remove from local state
            setSavedListings(savedListings.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting saved listing:', error);
            alert('Failed to delete. Please try again.');
        }
    };

    if (!user) {
        return (
            <div className="h-96 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <p className="text-gray-500 font-medium">Please sign in to view saved estimates</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (savedListings.length === 0) {
        return (
            <div className="h-96 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Saved Estimates Yet</h3>
                <p className="text-gray-500 text-center max-w-md">
                    Start estimating properties and click the "Save" button to keep track of your searches.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">My Saved Estimates</h2>
                <span className="text-sm text-gray-500">{savedListings.length} saved</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedListings.map((listing) => (
                    <div
                        key={listing.id}
                        className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden"
                    >
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                            <h3 className="text-xl font-bold text-white">{listing.locality}</h3>
                            <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                                {listing.property_type}
                            </span>
                        </div>

                        {/* Card Body */}
                        <div className="p-4">
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Estimated Value</p>
                                <p className="text-2xl font-bold text-blue-700">{listing.estimated_price}</p>
                            </div>

                            <div className="mb-4 pb-4 border-b border-gray-100">
                                <p className="text-xs text-gray-400">
                                    Saved on {new Date(listing.created_at).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDelete(listing.id)}
                                    className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MySavedListings;
