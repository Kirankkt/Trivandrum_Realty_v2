import { Source } from '../types';

export interface PropertyMarker {
    id: number;
    title: string;
    link: string;
    estimatedPrice?: number;
    estimatedSize?: number;
    type: 'Premium' | 'Mid-Range' | 'Budget' | 'Unknown';
}

export const parsePropertyMarkers = (sources: Source[]): PropertyMarker[] => {
    console.log('🔍 PropertyParser: Parsing', sources.length, 'sources');
    const markers: PropertyMarker[] = [];

    sources.forEach((source, index) => {
        const text = `${source.title} ${source.uri}`; // Search in both title and URL
        console.log(`📄 Source ${index + 1}:`, source.title.slice(0, 100));

        // 1. Extract Price - IMPROVED REGEX
        // Matches: ₹1.5 Cr, 1.5 Crore, 50 Lakhs, 50 L, Rs. 50 Lakhs, 1.5cr, 50lakh
        const priceRegex = /(?:₹|Rs\.?\s*|INR\s*)?(\d+(?:\.\d+)?)\s*(Cr|Crore|L|Lakh|Lakhs)/i;
        const priceMatch = text.match(priceRegex);
        let price: number | undefined;

        if (priceMatch) {
            const value = parseFloat(priceMatch[1]);
            const unit = priceMatch[2].toLowerCase();

            if (unit.includes('cr')) {
                price = value * 100; // Convert Crores to Lakhs
            } else if (unit.includes('l')) {
                price = value; // Already in Lakhs
            }
            console.log(`  💰 Found price: ₹${price}L (${priceMatch[0]})`);
        }

        // 2. Extract Size - IMPROVED REGEX  
        // Matches: 5 cents, 5.5 cent, 1500 sqft, 1500 sq ft, 1500sq.ft
        const sizeRegex = /(\d+(?:\.\d+)?)\s*(cent|cents|sqft|sq\.?\s*ft)/i;
        const sizeMatch = text.match(sizeRegex);
        let size: number | undefined;

        if (sizeMatch) {
            const value = parseFloat(sizeMatch[1]);
            const unit = sizeMatch[2].toLowerCase();

            if (unit.includes('cent')) {
                size = value;
            } else if (unit.includes('sq')) {
                size = value / 435.6; // Convert sqft to cents (approx)
            }
            console.log(`  📏 Found size: ${size?.toFixed(2)} cents (${sizeMatch[0]})`);
        }

        // 3. Classify Type
        let type: 'Premium' | 'Mid-Range' | 'Budget' | 'Unknown' = 'Unknown';
        if (price) {
            if (price > 100) type = 'Premium'; // > 1 Cr
            else if (price > 40) type = 'Mid-Range'; // 40L - 1 Cr
            else type = 'Budget'; // < 40L
        }

        // 4. Add to markers if we found useful info
        // RELAXED: Accept ANY listing with price OR size OR from property sites
        const isPropertySite = /99acres|magicbricks|housing\.com|olx/i.test(source.uri);

        if (price || size || isPropertySite) {
            console.log(`  ✅ ADDED to markers (Price: ${price || 'N/A'}, Size: ${size?.toFixed(1) || 'N/A'}, Type: ${type})`);
            markers.push({
                id: index + 1000, // Offset ID to avoid conflicts
                title: source.title,
                link: source.uri,
                estimatedPrice: price,
                estimatedSize: size,
                type: type
            });
        } else {
            console.log(`  ❌ SKIPPED (no price, size, or not a property site)`);
        }
    });

    console.log(`🎯 PropertyParser: Found ${markers.length} property markers`);
    return markers;
};
