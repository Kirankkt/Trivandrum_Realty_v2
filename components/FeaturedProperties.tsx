import React from 'react';
import { TrendingUp, MapPin, Home } from 'lucide-react';

interface ExampleProperty {
    id: string;
    imageUrl: string;
    locality: string;
    type: 'Villa' | 'House' | 'Plot';
    plotArea: number;
    estimatedPrice: string;
    tag?: 'Popular' | 'Trending';
}

// Using free Unsplash images for Kerala properties
const EXAMPLE_PROPERTIES: ExampleProperty[] = [
    {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        locality: 'Kowdiar',
        type: 'Villa',
        plotArea: 10,
        estimatedPrice: '₹2.8-3.2 Cr',
        tag: 'Popular'
    },
    {
        id: '2',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        locality: 'Pattom',
        type: 'House',
        plotArea: 6,
        estimatedPrice: '₹1.05-1.15 Cr'
    },
    {
        id: '3',
        imageUrl: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
        locality: 'Shangumugham',
        type: 'Plot',
        plotArea: 5,
        estimatedPrice: '₹40-45 Lakhs',
        tag: 'Trending'
    },
    {
        id: '4',
        imageUrl: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&q=80',
        locality: 'Kazhakkoottam',
        type: 'Plot',
        plotArea: 8,
        estimatedPrice: '₹1.1-1.3 Cr'
    }
];

export const FeaturedProperties: React.FC = () => {
    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                        Example Estimates
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Sample Property Valuations
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        See how our AI estimates property values across different localities in Trivandrum.
                        <span className="block text-sm mt-2 text-gray-500">
                            * These are illustrative examples, not actual listings
                        </span>
                    </p>
                </div>

                {/* Property Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {EXAMPLE_PROPERTIES.map((property) => (
                        <div
                            key={property.id}
                            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={property.imageUrl}
                                    alt={`${property.type} in ${property.locality}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {property.tag && (
                                    <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" />
                                        {property.tag}
                                    </div>
                                )}
                                <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                                    {property.plotArea} cents
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    <span className="font-semibold text-gray-900">{property.locality}</span>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <Home className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{property.type}</span>
                                </div>

                                <div className="border-t pt-3">
                                    <div className="text-xs text-gray-500 mb-1">Estimated Value</div>
                                    <div className="text-xl font-bold text-gray-900">{property.estimatedPrice}</div>
                                    <div className="text-xs text-green-600 mt-1">✓ AI-Verified Estimate</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Disclaimer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 italic">
                        Want to get an estimate for your property?{' '}
                        <a href="#estimate-form" className="text-blue-600 hover:text-blue-700 font-medium underline">
                            Try our free estimation tool →
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};
