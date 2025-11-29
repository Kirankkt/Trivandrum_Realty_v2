import React, { useState } from 'react';
import { PropertyMarker } from '../utils/propertyParser';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayerGroup, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Comparable, GeospatialAnalysis } from '../types';
import { formatCurrency } from '../utils/formatters';
import { LOCALITY_COORDS, LANDMARKS, TOP_SCHOOLS, MAJOR_HOSPITALS } from '../constants';

// Custom Icons - Professional styling
const createMarkerIcon = (color: string, emoji: string, size: number = 36) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
      <div style="
        background: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 3px 8px rgba(0,0,0,0.25);
        font-size: ${size * 0.5}px;
        cursor: pointer;
        transition: transform 0.2s;
      " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">${emoji}</div>
    `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
};

const Icons = {
    Selected: createMarkerIcon('#6366f1', '🏘️', 42), // Indigo - User's location
    Property: createMarkerIcon('#3b82f6', '🏠', 32), // Blue - Properties
    School: createMarkerIcon('#8b5cf6', '🏫', 28), // Purple
    Hospital: createMarkerIcon('#ef4444', '🏥', 28), // Red
    Airport: createMarkerIcon('#0ea5e9', '✈️', 32), // Sky blue
    Mall: createMarkerIcon('#ec4899', '🛍️', 28), // Pink
    Techpark: createMarkerIcon('#10b981', '💼', 28), // Green
    Premium: createMarkerIcon('#dc2626', '💎', 30), // Dark red
    MidRange: createMarkerIcon('#f59e0b', '🏘️', 28), // Amber
    Budget: createMarkerIcon('#16a34a', '🏡', 28), // Green
};

interface InteractiveMapProps {
    comparables: Comparable[];
    marketDepth?: GeospatialAnalysis['marketDepth'];
    propertyMarkers?: PropertyMarker[];
    locality: string;
    estimatedRate?: number;
    plotArea?: number;
}

interface LayerToggles {
    schools: boolean;
    hospitals: boolean;
    landmarks: boolean;
    properties: boolean;
    heatCircles: boolean;
}

interface Filters {
    priceMin: number;
    priceMax: number;
    distanceRadius: number; // km
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
    comparables,
    marketDepth,
    propertyMarkers = [],
    locality,
    estimatedRate,
    plotArea
}) => {
    // Get center coordinates from our GPS data
    const localityCoords = LOCALITY_COORDS[locality];
    const center: [number, number] = localityCoords
        ? [localityCoords.lat, localityCoords.lng]
        : [8.5241, 76.9366]; // Trivandrum fallback

    // State for layer toggles
    const [layers, setLayers] = useState<LayerToggles>({
        schools: false,
        hospitals: false,
        landmarks: false,
        properties: true,
        heatCircles: false
    });

    const [filters, setFilters] = useState<Filters>({
        priceMin: 0,
        priceMax: 100, // Lakhs
        distanceRadius: 5 // km
    });

    // Toggle layer visibility
    const toggleLayer = (layer: keyof LayerToggles) => {
        setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    };

    // Filter properties by price
    const filterProperties = (items: any[]) => {
        return items.filter(item => {
            const price = typeof item.price === 'number' ? item.price : 0;
            const normalizedPrice = price > 10000 ? price / 100000 : price;
            return normalizedPrice >= filters.priceMin && normalizedPrice <= filters.priceMax;
        });
    };

    return (
        <div className="relative">
            {/* Filter Panel */}
            <div className="mb-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                    </svg>
                    Map Filters & Layers
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Price Range Filter */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Price Range (Lakhs)</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={filters.priceMin}
                                onChange={(e) => setFilters(prev => ({ ...prev, priceMin: Number(e.target.value) }))}
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                                placeholder="Min"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number"
                                value={filters.priceMax}
                                onChange={(e) => setFilters(prev => ({ ...prev, priceMax: Number(e.target.value) }))}
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                                placeholder="Max"
                            />
                        </div>
                    </div>

                    {/* Distance Radius */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Search Radius: {filters.distanceRadius} km
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={filters.distanceRadius}
                            onChange={(e) => setFilters(prev => ({ ...prev, distanceRadius: Number(e.target.value) }))}
                            className="w-full"
                        />
                    </div>

                    {/* Layer Toggles */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Show Layers</label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => toggleLayer('schools')}
                                className={`px-2 py-1 text-xs rounded transition ${layers.schools ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                🏫 Schools
                            </button>
                            <button
                                onClick={() => toggleLayer('hospitals')}
                                className={`px-2 py-1 text-xs rounded transition ${layers.hospitals ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                🏥 Hospitals
                            </button>
                            <button
                                onClick={() => toggleLayer('landmarks')}
                                className={`px-2 py-1 text-xs rounded transition ${layers.landmarks ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                🏛️ Landmarks
                            </button>
                            <button
                                onClick={() => toggleLayer('heatCircles')}
                                className={`px-2 py-1 text-xs rounded transition ${layers.heatCircles ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                🎯 Heat Zones
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="h-[550px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 z-0 relative">
                <MapContainer
                    center={center}
                    zoom={13}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* User's Selected Location - Always visible */}
                    <Marker position={center} icon={Icons.Selected}>
                        <Popup>
                            <div className="min-w-[200px]">
                                <h3 className="font-bold text-indigo-700 mb-2 text-base">{locality}</h3>
                                <div className="space-y-1.5 text-sm">
                                    {estimatedRate && (
                                        <div className="flex justify-between bg-indigo-50 px-2 py-1 rounded">
                                            <span className="text-gray-600">Land Rate:</span>
                                            <span className="font-semibold text-indigo-700">{formatCurrency(estimatedRate)}/cent</span>
                                        </div>
                                    )}
                                    {plotArea && (
                                        <div className="flex justify-between bg-gray-50 px-2 py-1 rounded">
                                            <span className="text-gray-600">Plot Size:</span>
                                            <span className="font-semibold text-gray-800">{plotArea} cents</span>
                                        </div>
                                    )}
                                    <p className="text-indigo-600 font-medium pt-2 border-t mt-2 text-center">
                                        📍 Your Selected Location
                                    </p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>

                    {/* Heat Circles - Show price zones */}
                    {layers.heatCircles && estimatedRate && (
                        <>
                            <Circle
                                center={center}
                                radius={500}
                                pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1 }}
                            />
                            <Circle
                                center={center}
                                radius={1500}
                                pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.08 }}
                            />
                            <Circle
                                center={center}
                                radius={3000}
                                pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.05 }}
                            />
                        </>
                    )}

                    {/* Properties with Clustering */}
                    {layers.properties && (
                        <MarkerClusterGroup
                            chunkedLoading
                            maxClusterRadius={50}
                            spiderfyOnMaxZoom={true}
                            showCoverageOnHover={false}
                        >
                            {/* Property Markers (Deterministic - Parsed from Serper) */}
                            {propertyMarkers.map((marker) => (
                                <Marker
                                    key={`prop-${marker.id}`}
                                    position={[center[0] + (Math.random() - 0.5) * 0.01, center[1] + (Math.random() - 0.5) * 0.01]}
                                    icon={marker.type === 'Premium' ? Icons.Premium : marker.type === 'Mid-Range' ? Icons.MidRange : Icons.Budget}
                                >
                                    <Popup>
                                        <div className="min-w-[200px]">
                                            <h4 className="font-bold text-gray-800 mb-1 line-clamp-2">{marker.title}</h4>
                                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                                <span className="font-semibold text-teal-700 mr-2">
                                                    {marker.estimatedPrice ? `₹${marker.estimatedPrice} Lakhs` : 'Price on Request'}
                                                </span>
                                                {marker.estimatedSize && (
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                                        {marker.estimatedSize.toFixed(1)} cents
                                                    </span>
                                                )}
                                            </div>
                                            <a
                                                href={marker.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full text-center bg-teal-600 text-white py-1.5 rounded text-sm hover:bg-teal-700 transition"
                                            >
                                                View Listing
                                            </a>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}

                            {/* Comparables (AI-generated) */}
                            {filterProperties(comparables.filter(c => c.link?.startsWith('http'))).map((comp) => {
                                const price = typeof comp.price === 'number' ? comp.price : 0;
                                const normalizedPrice = price > 10000 ? price / 100000 : price;
                                const lat = center[0] + ((comp as any).latOffset || (Math.random() - 0.5) * 0.015);
                                const lng = center[1] + ((comp as any).lngOffset || (Math.random() - 0.5) * 0.015);

                                let icon = Icons.MidRange;
                                if (normalizedPrice > 100) icon = Icons.Premium;
                                else if (normalizedPrice < 40) icon = Icons.Budget;

                                return (
                                    <Marker
                                        key={`comp-${comp.id || Math.random()}`}
                                        position={[lat, lng]}
                                        icon={icon}
                                    >
                                        <Popup>
                                            <div className="min-w-[200px]">
                                                <h4 className="font-bold text-gray-800 mb-1">{comp.title}</h4>
                                                <p className="text-sm text-gray-600 mb-2">{comp.description}</p>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs text-gray-500">Price:</span>
                                                    <span className="font-semibold text-teal-700">₹{normalizedPrice.toFixed(1)}L</span>
                                                </div>
                                                <a
                                                    href={comp.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full text-center bg-teal-600 text-white py-1.5 rounded text-sm hover:bg-teal-700 transition"
                                                >
                                                    View Details
                                                </a>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}

                            {/* Market Depth (AI-generated) */}
                            {filterProperties(marketDepth || []).map((item) => {
                                let icon = Icons.MidRange;
                                if (item.type === 'Premium') icon = Icons.Premium;
                                if (item.type === 'Budget') icon = Icons.Budget;

                                const lat = center[0] + ((item as any).latOffset || (Math.random() - 0.5) * 0.015);
                                const lng = center[1] + ((item as any).lngOffset || (Math.random() - 0.5) * 0.015);
                                const price = typeof item.price === 'number' ? item.price : 0;
                                const normalizedPrice = price > 10000 ? price / 100000 : price;

                                return (
                                    <Marker
                                        key={`depth-${Math.random()}`}
                                        position={[lat, lng]}
                                        icon={icon}
                                    >
                                        <Popup>
                                            <div className="min-w-[200px]">
                                                <h4 className="font-bold text-gray-800 mb-1">{item.title}</h4>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-500">Type:</span>
                                                    <span className="font-semibold text-gray-700">{item.type}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-500">Price:</span>
                                                    <span className="font-semibold text-teal-700">₹{normalizedPrice.toFixed(1)}L</span>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MarkerClusterGroup>
                    )}

                    {/* Schools Layer */}
                    {layers.schools && (
                        <LayerGroup>
                            {TOP_SCHOOLS.map((school, idx) => (
                                <Marker
                                    key={`school-${idx}`}
                                    position={[school.coords.lat, school.coords.lng]}
                                    icon={Icons.School}
                                >
                                    <Popup>
                                        <div className="min-w-[150px]">
                                            <h4 className="font-bold text-purple-700 mb-1">🏫 {school.name}</h4>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </LayerGroup>
                    )}

                    {/* Hospitals Layer */}
                    {layers.hospitals && (
                        <LayerGroup>
                            {MAJOR_HOSPITALS.map((hospital, idx) => (
                                <Marker
                                    key={`hospital-${idx}`}
                                    position={[hospital.coords.lat, hospital.coords.lng]}
                                    icon={Icons.Hospital}
                                >
                                    <Popup>
                                        <div className="min-w-[150px]">
                                            <h4 className="font-bold text-red-700 mb-1">🏥 {hospital.name}</h4>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </LayerGroup>
                    )}

                    {/* Landmarks Layer */}
                    {layers.landmarks && (
                        <LayerGroup>
                            <Marker position={[LANDMARKS.AIRPORT.coords.lat, LANDMARKS.AIRPORT.coords.lng]} icon={Icons.Airport}>
                                <Popup>
                                    <div className="min-w-[150px]">
                                        <h4 className="font-bold text-sky-700 mb-1">✈️ {LANDMARKS.AIRPORT.name}</h4>
                                    </div>
                                </Popup>
                            </Marker>
                            <Marker position={[LANDMARKS.LULU_MALL.coords.lat, LANDMARKS.LULU_MALL.coords.lng]} icon={Icons.Mall}>
                                <Popup>
                                    <div className="min-w-[150px]">
                                        <h4 className="font-bold text-pink-700 mb-1">🛍️ {LANDMARKS.LULU_MALL.name}</h4>
                                    </div>
                                </Popup>
                            </Marker>
                            <Marker position={[LANDMARKS.TECHNOPARK.coords.lat, LANDMARKS.TECHNOPARK.coords.lng]} icon={Icons.Techpark}>
                                <Popup>
                                    <div className="min-w-[150px]">
                                        <h4 className="font-bold text-green-700 mb-1">💼 {LANDMARKS.TECHNOPARK.name}</h4>
                                    </div>
                                </Popup>
                            </Marker>
                        </LayerGroup>
                    )}
                </MapContainer>
            </div>

            {/* Legend */}
            <div className="mt-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <h5 className="font-semibold text-gray-800 mb-2 text-sm">Map Legend</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {layers.properties && (
                        <>
                            <div className="flex items-center"><span className="text-base mr-1.5">💎</span> Premium</div>
                            <div className="flex items-center"><span className="text-base mr-1.5">🏘️</span> Mid-Range</div>
                            <div className="flex items-center"><span className="text-base mr-1.5">🏡</span> Budget</div>
                        </>
                    )}
                    {layers.landmarks && (
                        <>
                            <div className="flex items-center"><span className="text-base mr-1.5">✈️</span> Airport</div>
                            <div className="flex items-center"><span className="text-base mr-1.5">🛍️</span> Mall</div>
                            <div className="flex items-center"><span className="text-base mr-1.5">💼</span> IT Park</div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InteractiveMap;
