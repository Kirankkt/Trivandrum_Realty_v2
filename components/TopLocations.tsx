import React from 'react';

interface LocationProfile {
    id: number;
    name: string;
    tagline: string;
    description: string;
    priceRange: string;
    rentalYield: string;
    outlook: 'Positive' | 'Stable' | 'Neutral';
    tags: string[];
}

const TOP_LOCATIONS: LocationProfile[] = [
    {
        id: 1,
        name: "Kazhakkoottam",
        tagline: "The IT Corridor & Future Hub",
        description: "Home to Technopark and the upcoming Taurus Downtown Mall. The epicenter of Trivandrum's IT growth, offering high rental demand from tech professionals.",
        priceRange: "₹12 - 18 Lakhs/cent",
        rentalYield: "4.5 - 5.5%",
        outlook: "Positive",
        tags: ["Tech Hub", "High Rental", "Commercial"]
    },
    {
        id: 2,
        name: "Kowdiar",
        tagline: "The Beverly Hills of Trivandrum",
        description: "The most prestigious address in the city. Known for wide avenues, royal heritage, and luxury villas. Prices are stable but premium.",
        priceRange: "₹25 - 40 Lakhs/cent",
        rentalYield: "2.5 - 3.5%",
        outlook: "Stable",
        tags: ["Luxury", "Premium", "Heritage"]
    },
    {
        id: 3,
        name: "Sasthamangalam",
        tagline: "Upscale Residential & Connected",
        description: "A preferred choice for upper-middle-class families. Excellent connectivity to the city center and top schools. consistently high demand.",
        priceRange: "₹18 - 25 Lakhs/cent",
        rentalYield: "3.0 - 4.0%",
        outlook: "Stable",
        tags: ["Residential", "Central", "Schools"]
    },
    {
        id: 4,
        name: "Vizhinjam",
        tagline: "The Port City Boom",
        description: "With the International Seaport becoming operational, this area is poised for explosive growth in logistics, warehousing, and commercial real estate.",
        priceRange: "₹8 - 15 Lakhs/cent",
        rentalYield: "3.5 - 4.5%",
        outlook: "Positive",
        tags: ["Port", "Future Growth", "Investment"]
    },
    {
        id: 5,
        name: "Pattom",
        tagline: "Commercial Nerve Center",
        description: "Ideally located with excellent connectivity. A mix of commercial complexes and residential apartments. High land value due to scarcity.",
        priceRange: "₹20 - 30 Lakhs/cent",
        rentalYield: "4.0 - 5.0%",
        outlook: "Stable",
        tags: ["Commercial", "Central", "Connectivity"]
    },
    {
        id: 6,
        name: "Vattiyoorkavu",
        tagline: "Green & Serene Residential",
        description: "Offers a quieter, greener lifestyle while remaining accessible. Popular for independent houses and villas. Good value for money.",
        priceRange: "₹8 - 12 Lakhs/cent",
        rentalYield: "3.0 - 3.8%",
        outlook: "Positive",
        tags: ["Residential", "Green", "Villas"]
    },
    {
        id: 7,
        name: "Peroorkada",
        tagline: "Established & Self-Sufficient",
        description: "A well-developed suburb with its own markets, schools, and hospitals. A safe bet for long-term residential living.",
        priceRange: "₹10 - 15 Lakhs/cent",
        rentalYield: "3.2 - 4.0%",
        outlook: "Stable",
        tags: ["Suburb", "Family", "Amenities"]
    },
    {
        id: 8,
        name: "Technopark Area (Phase 3)",
        tagline: "Walk-to-Work Lifestyle",
        description: "Areas surrounding Phase 3 and the bypass. Extremely high demand for apartments and hostels. Best for rental income investors.",
        priceRange: "₹10 - 16 Lakhs/cent",
        rentalYield: "5.0 - 6.0%",
        outlook: "Positive",
        tags: ["Rental Income", "IT", "Apartments"]
    },
    {
        id: 9,
        name: "Mannanthala",
        tagline: "Educational Hub",
        description: "Proximity to Mar Ivanios Vidya Nagar and other institutions makes it a student housing hotspot. Steady appreciation.",
        priceRange: "₹9 - 14 Lakhs/cent",
        rentalYield: "4.0 - 4.8%",
        outlook: "Stable",
        tags: ["Education", "Student Housing", "Steady"]
    },
    {
        id: 10,
        name: "Sreekaryam",
        tagline: "Gateway to Technopark",
        description: "Strategically located between the city and the IT corridor. High density and excellent public transport connectivity.",
        priceRange: "₹12 - 18 Lakhs/cent",
        rentalYield: "3.8 - 4.5%",
        outlook: "Positive",
        tags: ["Connectivity", "Strategic", "Busy"]
    }
];

const TopLocations: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-xl p-8 text-white shadow-lg">
                <h2 className="text-3xl font-bold mb-2">Trivandrum Market Trends 2024</h2>
                <p className="text-teal-100 max-w-2xl">
                    A curated analysis of the top 10 investment hotspots in the capital city.
                    Data combined from market surveys, registration trends, and developer insights.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOP_LOCATIONS.map((loc) => (
                    <div key={loc.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                        <div className="p-6 flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-800">{loc.name}</h3>
                                {loc.outlook === 'Positive' ? (
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                        High Growth
                                    </span>
                                ) : (
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Stable
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-teal-600 font-semibold mb-3">{loc.tagline}</p>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{loc.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {loc.tags.map((tag, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                            <div className="flex justify-between items-center text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider">Avg Price</p>
                                    <p className="font-bold text-gray-800">{loc.priceRange}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500 text-xs uppercase tracking-wider">Rental Yield</p>
                                    <p className="font-bold text-teal-600">{loc.rentalYield}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopLocations;
