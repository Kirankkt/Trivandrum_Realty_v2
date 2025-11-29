import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    locality: string;
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose, locality }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [interestType, setInterestType] = useState<'Buy' | 'Sell' | 'Explore'>('Buy');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!name.trim() || !phone.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        // Phone validation (Indian format)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            alert('Please enter a valid 10-digit Indian mobile number');
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase.from('leads').insert({
                name: name.trim(),
                phone_number: phone.trim(),
                interest_type: interestType,
                locality: locality,
                notes: notes.trim() || null,
                status: 'New'
            });

            if (error) throw error;

            setSubmitStatus('success');

            // Reset form after 2 seconds and close
            setTimeout(() => {
                setName('');
                setPhone('');
                setInterestType('Buy');
                setNotes('');
                setSubmitStatus('idle');
                onClose();
            }, 2000);

        } catch (err) {
            console.error('Error submitting lead:', err);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-scale-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">Contact Agent</h3>
                            <p className="text-blue-100 text-sm">Get expert guidance for {locality}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors"
                            disabled={isSubmitting}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {submitStatus === 'success' ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h4>
                            <p className="text-gray-600">An agent will contact you within 24 hours.</p>
                        </div>
                    ) : (
                        <>
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Your Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="10-digit mobile number"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Interest Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    I'm Interested In
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['Buy', 'Sell', 'Explore'] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setInterestType(type)}
                                            disabled={isSubmitting}
                                            className={`py-3 px-4 rounded-lg font-medium transition-all ${interestType === type
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {type === 'Buy' ? '🏠 Buy' : type === 'Sell' ? '💰 Sell' : '🔍 Explore'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes (Optional) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any specific requirements or questions..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Error Message */}
                            {submitStatus === 'error' && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                                    Failed to submit. Please try again.
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        Connect with Agent
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center">
                                By submitting, you agree to be contacted by verified real estate agents.
                            </p>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default LeadCaptureModal;
