import React from 'react';
import { PredictionResult } from '../types';
import InteractiveMap from './InteractiveMap';
import { LOCALITY_TIERS } from '../constants';
import { calculateDistance } from '../utils/geoCalculations';
import { LOCALITY_COORDS, LANDMARKS } from '../constants';

interface GeospatialViewProps {
    result: PredictionResult;
    locality: string;
}

const GeospatialView: React.FC<GeospatialViewProps> = ({ result, locality }) => {
    // Calculate data-driven stats
    const comparables = result.developerAnalysis?.comparables || [];
    const marketDepth = result.geoSpatial?.marketDepth || [];
    const propertyMarkers = result.propertyMarkers || []; // NEW: Deterministic markers
    const allProperties = [...comparables, ...(marketDepth as any[]), ...propertyMarkers];

    // Calculate real statistics
    const propertyCount = allProperties.length;
    const avgPrice = propertyCount > 0
        ? allProperties.reduce((sum, p) => {

            export default GeospatialView;
