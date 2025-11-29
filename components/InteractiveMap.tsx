
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
                        {/* Property Markers (Parsed from Serper) */}
                        {layers.properties && propertyMarkers && propertyMarkers.map((marker) => (
                            <Marker
                                key={`prop-${marker.id}`}
                                position={[center[0] + (Math.random() - 0.5) * 0.01, center[1] + (Math.random() - 0.5) * 0.01]} // Small jitter to avoid overlap
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
                                                    {marker.estimatedSize} cents
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

                        {/* Comparables */}
                        {filterProperties(comparables.filter(c => c.link?.startsWith('http'))).map((comp) => {
                            const price = typeof comp.price === 'number' ? comp.price : 0;
                            const normalizedPrice = price > 10000 ? price / 100000 : price;
                            const offset = () => (Math.random() - 0.5) * 0.01;

                            return (
                                <Marker
                                    key={`comp-${comp.id}`}
                                    position={[center[0] + offset(), center[1] + offset()]}
                                    icon={Icons.Property}
                                >
                                    <Popup>
                                        <div className="min-w-[220px]">
                                            <h4 className="font-bold text-gray-800  mb-2 line-clamp-2">{comp.title || 'Property'}</h4>
                                            <div className="flex justify-between items-center mb-3 bg-blue-50 px-3 py-2 rounded">
                                                <span className="text-gray-600 text-sm">{comp.size} cents</span>
                                                <span className="font-bold text-blue-700">{formatCurrency(normalizedPrice)}</span>
                                            </div>
                                            <a
                                                href={comp.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block text-center w-full bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                            >
                                                View Listing →
                                            </a>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}

                        {/* Market Depth */}
                        {filterProperties(marketDepth || []).map((item) => {
                            let icon = Icons.MidRange;
                            if (item.type === 'Premium') icon = Icons.Premium;
                            if (item.type === 'Budget') icon = Icons.Budget;

                            const lat = center[0] + ((item as any).latOffset || (Math.random() - 0.5) * 0.015);
                            const lng = center[1] + ((item as any).lngOffset || (Math.random() - 0.5) * 0.015);
                            const price = typeof item.price === 'number' ? item.price : 0;
                            const normalizedPrice = price > 10000 ? price / 100000 : price;

                            return (
                                <Marker key={`depth-${item.id}`} position={[lat, lng]} icon={icon}>
                                    <Popup>
                                        <div className="min-w-[200px]">
                                            <span className={`inline-block mb-2 px-3 py-1 text-xs rounded-full font-semibold ${item.type === 'Premium' ? 'bg-red-100 text-red-700' :
                                                item.type === 'Budget' ? 'bg-green-100 text-green-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {item.type}
                                            </span>
                                            <h4 className="font-bold text-gray-800 text-sm mb-2">
                                                {(item as any).title || `${item.type} Property`}
                                            </h4>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600">{item.size} cents</span>
                                                <span className="font-bold">{formatCurrency(normalizedPrice)}</span>
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
                                    <div className="min-w-[180px]">
                                        <h4 className="font-bold text-purple-700 mb-1">{school.name}</h4>
                                        <p className="text-xs text-gray-600">📚 Educational Institution</p>
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
                                    <div className="min-w-[180px]">
                                        <h4 className="font-bold text-red-700 mb-1">{hospital.name}</h4>
                                        <p className="text-xs text-gray-600">🏥 Healthcare Facility</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </LayerGroup>
                )}

                {/* Landmarks Layer */}
                {layers.landmarks && (
                    <LayerGroup>
                        <Marker
                            position={[LANDMARKS.AIRPORT.coords.lat, LANDMARKS.AIRPORT.coords.lng]}
                            icon={Icons.Airport}
                        >
                            <Popup>
                                <div className="min-w-[180px]">
                                    <h4 className="font-bold text-sky-700">{LANDMARKS.AIRPORT.name}</h4>
                                    <p className="text-xs text-gray-600">✈️ International Airport</p>
                                </div>
                            </Popup>
                        </Marker>

                        <Marker
                            position={[LANDMARKS.LULU_MALL.coords.lat, LANDMARKS.LULU_MALL.coords.lng]}
                            icon={Icons.Mall}
                        >
                            <Popup>
                                <div className="min-w-[180px]">
                                    <h4 className="font-bold text-pink-700">{LANDMARKS.LULU_MALL.name}</h4>
                                    <p className="text-xs text-gray-600">🛍️ Shopping Mall</p>
                                </div>
                            </Popup>
                        </Marker>

                        <Marker
                            position={[LANDMARKS.TECHNOPARK.coords.lat, LANDMARKS.TECHNOPARK.coords.lng]}
                            icon={Icons.Techpark}
                        >
                            <Popup>
                                <div className="min-w-[180px]">
                                    <h4 className="font-bold text-green-700">{LANDMARKS.TECHNOPARK.name}</h4>
                                    <p className="text-xs text-gray-600">💼 IT Park</p>
                                </div>
                            </Popup>
                        </Marker>
                    </LayerGroup>
                )}
            </MapContainer>

            {/* Enhanced Legend */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur p-3 rounded-lg shadow-lg z-[1000] text-xs border border-gray-200 max-w-[200px]">
                <h4 className="font-bold text-gray-700 mb-2 pb-2 border-b">Map Legend</h4>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="text-base mr-1.5">🏘️</span>
                            <span className="text-gray-700">Selected</span>
                        </div>
                    </div>
                    {layers.properties && (
                        <>
                            <div className="flex items-center"><span className="text-base mr-1.5">🏠</span> Properties</div>
                            <div className="flex items-center"><span className="text-base mr-1.5">💎</span> Premium</div>
                            <div className="flex items-center"><span className="text-base mr-1.5">🏘️</span> Mid-Range</div>
                            <div className="flex items-center"><span className="text-base mr-1.5">🏡</span> Budget</div>
                        </>
                    )}
                    {layers.schools && <div className="flex items-center"><span className="text-base mr-1.5">🏫</span> Schools</div>}
                    {layers.hospitals && <div className="flex items-center"><span className="text-base mr-1.5">🏥</span> Hospitals</div>}
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
    </div>
);

export default InteractiveMap;
