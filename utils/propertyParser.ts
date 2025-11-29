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
    const markers: PropertyMarker[] = [];

    sources.forEach((source, index) => {
        const text = `${source.title} ${source.uri}`; // Search in both title and URL

        // 1. Extract Price
        // Matches: ₹1.5 Cr, 1.5 Crore, 50 Lakhs, 50 L, Rs. 50 Lakhs
        const priceRegex = /(?:₹|Rs\.?|INR)\s*(\d+(?:\.\d+)?)\s*(Cr|Crore|L|Lakh|Lakhs)/i;
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
        }

        // 2. Extract Size
        // Matches: 5 cents, 5.5 cent, 1500 sqft, 1500 sq ft
        const sizeRegex = /(\d+(?:\.\d+)?)\s*(cent|cents|sqft|sq\s*ft)/i;
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
        }

        // 3. Classify Type
        let type: 'Premium' | 'Mid-Range' | 'Budget' | 'Unknown' = 'Unknown';
        if (price) {
            if (price > 100) type = 'Premium'; // > 1 Cr
            else if (price > 40) type = 'Mid-Range'; // 40L - 1 Cr
            else type = 'Budget'; // < 40L
        }

        // 4. Add to markers if we found useful info
        // We prioritize listings with Price OR Size to be useful
        if (price || size) {
            markers.push({
                id: index + 1000, // Offset ID to avoid conflicts
                title: source.title,
                link: source.uri,
                estimatedPrice: price,
                estimatedSize: size,
                type: type
            });
        }
    });

    return markers;
};
