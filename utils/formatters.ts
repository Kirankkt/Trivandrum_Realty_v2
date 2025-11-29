// Utility to format currency in Lakhs/Crores
export const formatCurrency = (value: number): string => {
    // Handle invalid values
    if (isNaN(value) || value === null || value === undefined) {
        return '₹0 L';
    }
    // If value is extremely high (likely in Rupees instead of Lakhs), convert it
    if (value > 10000) {
        value = value / 100000; // Convert Rupees to Lakhs
    }
    // Format in Crores if >= 100 Lakhs
    if (value >= 100) {
        return `₹${(value / 100).toFixed(2)} Cr`;
    }
    // Format in Lakhs
    return `₹${value.toFixed(2)} L`;
};
// Ensure price is in Lakhs (detect if it's in Rupees)
export const normalizePriceToLakhs = (price: number): number => {
    if (isNaN(price) || price === null || price === undefined) {
        return 0;
    }
    // If price > 10000, it's likely in Rupees, convert to Lakhs
    return price > 10000 ? price / 100000 : price;
};
