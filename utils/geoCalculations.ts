/**
 * Geospatial Calculation Utilities
 * Professional-grade distance and coordinate calculations
 */

export interface Coordinates {
    lat: number;
    lng: number;
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 * Accuracy: ~0.5% error (good enough for city-level calculations)
 */
export function calculateDistance(point1: Coordinates, point2: Coordinates): number {
    const R = 6371; // Earth's radius in kilometers

    const lat1Rad = toRadians(point1.lat);
    const lat2Rad = toRadians(point2.lat);
    const deltaLat = toRadians(point2.lat - point1.lat);
    const deltaLng = toRadians(point2.lng - point1.lng);

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Check if a point is within a given radius from center
 */
export function isWithinRadius(
    point: Coordinates,
    center: Coordinates,
    radiusKm: number
): boolean {
    return calculateDistance(point, center) <= radiusKm;
}

/**
 * Get bearing (direction) from point1 to point2
 * Returns degrees (0-360): 0=North, 90=East, 180=South, 270=West
 */
export function getBearing(point1: Coordinates, point2: Coordinates): number {
    const lat1Rad = toRadians(point1.lat);
    const lat2Rad = toRadians(point2.lat);
    const deltaLng = toRadians(point2.lng - point1.lng);

    const y = Math.sin(deltaLng) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
        Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLng);

    const bearing = toDegrees(Math.atan2(y, x));
    return (bearing + 360) % 360; // Normalize to 0-360
}

/**
 * Get compass direction from bearing
 */
export function getCompassDirection(bearing: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
}

/**
 * Find nearest point from a list
 */
export function findNearest<T extends { coords: Coordinates; name: string }>(
    from: Coordinates,
    candidates: T[]
): T & { distance: number } {
    let nearest = candidates[0];
    let minDistance = Infinity;

    for (const candidate of candidates) {
        const distance = calculateDistance(from, candidate.coords);
        if (distance < minDistance) {
            minDistance = distance;
            nearest = candidate;
        }
    }

    return { ...nearest, distance: minDistance };
}

/**
 * Sort points by distance from a reference point
 */
export function sortByDistance<T extends { coords: Coordinates }>(
    from: Coordinates,
    points: T[]
): Array<T & { distance: number }> {
    return points
        .map(point => ({
            ...point,
            distance: calculateDistance(from, point.coords)
        }))
        .sort((a, b) => a.distance - b.distance);
}

// Helper functions
function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

function toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
}
