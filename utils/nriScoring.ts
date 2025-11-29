/**
 * NRI Suitability Scoring - Professional Algorithms
 * Deterministic scoring based on real data and transparent formulas
 */

import { calculateDistance, findNearest, sortByDistance } from './geoCalculations';
import type { Coordinates } from './geoCalculations';
import {
    LOCALITY_COORDS,
    LANDMARKS,
    LOCALITY_TIERS,
    TOP_SCHOOLS,
    MAJOR_HOSPITALS
} from '../constants';

export interface NRIMetrics {
    suitabilityScore: number; // 0-10
    airportDist: number; // km
    mallDist: number; // km
    isVillaFeasible: boolean;
    villaFeasibilityReason: string;
    socialInfra: {
        nearestSchool: { name: string; distance: number };
        nearestHospital: { name: string; distance: number };
    };
}

/**
 * Calculate NRI Suitability Score (0-10)
 * 
 * Formula:
 * - Airport proximity (max 3 pts): <10km=3, 10-20km=2, >20km=1
 * - Locality tier (max 3 pts): Premium=3, Tech=2.5, City=2, Suburb=1
 * - Plot size feasibility (max 2 pts): ≥5 cents=2, 3-5=1, <3=0
 * - Beach proximity (max 2 pts): <5km=2, 5-10km=1, >10km=0
 */
export function calculateNRISuitability(
    locality: string,
    plotSize: number,
    beachDistance: number
): number {
    const localityCoords = LOCALITY_COORDS[locality];
    if (!localityCoords) return 5; // Default fallback

    // Airport proximity scoring (0-3 points)
    const airportDist = calculateDistance(localityCoords, LANDMARKS.AIRPORT.coords);
    let airportScore = 1;
    if (airportDist < 10) airportScore = 3;
    else if (airportDist < 20) airportScore = 2;

    // Locality tier scoring (0-3 points)
    const tier = LOCALITY_TIERS[locality] || 'Suburb';
    const tierScores = { Premium: 3, Tech: 2.5, City: 2, Suburb: 1 };
    const tierScore = tierScores[tier];

    // Plot size feasibility (0-2 points)
    let sizeScore = 0;
    if (plotSize >= 5) sizeScore = 2;
    else if (plotSize >= 3) sizeScore = 1;

    // Beach proximity (0-2 points)
    let beachScore = 0;
    if (beachDistance < 5) beachScore = 2;
    else if (beachDistance < 10) beachScore = 1;

    const totalScore = airportScore + tierScore + sizeScore + beachScore;

    // Round to 1 decimal place, cap at 10
    return Math.min(10, Math.round(totalScore * 10) / 10);
}

/**
 * Get distances to key amenities
 */
export function getAmenityDistances(locality: string): {
    airportDist: number;
    mallDist: number;
    techparkDist: number;
} {
    const localityCoords = LOCALITY_COORDS[locality];
    if (!localityCoords) {
        return { airportDist: 15, mallDist: 10, techparkDist: 12 }; // Fallback
    }

    return {
        airportDist: calculateDistance(localityCoords, LANDMARKS.AIRPORT.coords),
        mallDist: calculateDistance(localityCoords, LANDMARKS.LULU_MALL.coords),
        techparkDist: calculateDistance(localityCoords, LANDMARKS.TECHNOPARK.coords)
    };
}

/**
 * Determine villa feasibility based on plot size and locality
 */
export function assessVillaFeasibility(
    plotSize: number,
    locality: string
): { isVillaFeasible: boolean; reason: string } {
    const tier = LOCALITY_TIERS[locality] || 'Suburb';

    // Minimum plot sizes for villa development
    const minSizeForTier = {
        Premium: 5,
        Tech: 4,
        City: 4,
        Suburb: 3
    };

    const requiredSize = minSizeForTier[tier];
    const isVillaFeasible = plotSize >= requiredSize;

    if (isVillaFeasible) {
        if (tier === 'Premium') {
            return {
                isVillaFeasible: true,
                reason: `Excellent for luxury villa development in ${locality}'s premium market. Plot size sufficient for high-end construction.`
            };
        } else if (tier === 'Tech') {
            return {
                isVillaFeasible: true,
                reason: `Good for modern villa development. High demand from IT professionals in ${locality}.`
            };
        } else {
            return {
                isVillaFeasible: true,
                reason: `Suitable for villa construction. ${plotSize} cents provides adequate space for residential development.`
            };
        }
    } else {
        return {
            isVillaFeasible: false,
            reason: `Plot size (${plotSize} cents) below recommended minimum of ${requiredSize} cents for ${locality}. Consider increasing land area or opting for compact design.`
        };
    }
}

/**
 * Find nearest school and hospital for "Mom Test" social infrastructure
 */
export function getNearestSocialInfra(locality: string): {
    nearestSchool: { name: string; distance: number };
    nearestHospital: { name: string; distance: number };
} {
    const localityCoords = LOCALITY_COORDS[locality];

    if (!localityCoords) {
        // Fallback data
        return {
            nearestSchool: { name: 'Local School', distance: 2.5 },
            nearestHospital: { name: 'Community Hospital', distance: 3.0 }
        };
    }

    const nearestSchool = findNearest(localityCoords, TOP_SCHOOLS.map(s => ({ ...s, name: s.name, coords: s.coords })));
    const nearestHospital = findNearest(localityCoords, MAJOR_HOSPITALS.map(h => ({ ...h, name: h.name, coords: h.coords })));

    return {
        nearestSchool: {
            name: nearestSchool.name,
            distance: Math.round(nearestSchool.distance * 10) / 10
        },
        nearestHospital: {
            name: nearestHospital.name,
            distance: Math.round(nearestHospital.distance * 10) / 10
        }
    };
}

/**
 * Generate complete NRI metrics for a locality
 */
export function generateNRIMetrics(
    locality: string,
    plotSize: number,
    beachDistance: number
): NRIMetrics {
    const distances = getAmenityDistances(locality);
    const feasibility = assessVillaFeasibility(plotSize, locality);
    const socialInfra = getNearestSocialInfra(locality);
    const suitabilityScore = calculateNRISuitability(locality, plotSize, beachDistance);

    return {
        suitabilityScore,
        airportDist: Math.round(distances.airportDist * 10) / 10,
        mallDist: Math.round(distances.mallDist * 10) / 10,
        isVillaFeasible: feasibility.isVillaFeasible,
        villaFeasibilityReason: feasibility.reason,
        socialInfra
    };
}
