import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Comparable } from '../types';
// Fix for default marker icon issues in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
interface InteractiveMapProps {
    comparables: Comparable[];
    locality: string;
}
// Component to update map center when locality changes
const RecenterMap: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 13);
    }, [center, map]);
    return null;
};
// Approximate coordinates for Trivandrum localities (Fallback)
// In a real app, you'd use a Geocoding API.
const LOCALITY_COORDS: Record<string, [number, number]> = {
    'Trivandrum': [8.5241, 76.9366],
    'Kowdiar': [8.5241, 76.9566],
    'Kazhakkoottam': [8.5686, 76.8731],
    'Technopark Area': [8.5581, 76.8816],
    'Veli': [8.5179, 76.8924],
    'St. Andrews': [8.5960, 76.8640],
    'Kovalam': [8.4004, 76.9787],
    'Varkala': [8.7379, 76.7163],
    'Sasthamangalam': [8.5126, 76.9678],
    'Pattom': [8.5284, 76.9426],
    'Peroorkada': [8.5432, 76.9698],
    'Vattiyoorkavu': [8.5350, 76.9850],
    'Mannanthala': [8.5680, 76.9550],
    'Sreekaryam': [8.5480, 76.9250],
    'Ulloor': [8.5400, 76.9300],
    'Medical College': [8.5230, 76.9280],
    'Pettah': [8.5000, 76.9300],
    'Chackai': [8.4950, 76.9200],
    'Enchakkal': [8.4900, 76.9300],
    'East Fort': [8.4850, 76.9450],
    'Thampanoor': [8.4900, 76.9500],
    'Vazhuthacaud': [8.5050, 76.9600],
    'Jagathy': [8.5000, 76.9650],
    'Poojappura': [8.4950, 76.9750],
    'Thirumala': [8.5050, 76.9900],
    'Nemom': [8.4600, 77.0000],
    'Pappanamcode': [8.4750, 76.9850],
    'Karamana': [8.4850, 76.9700],
    'Attukal': [8.4700, 76.9500],
    'Manacaud': [8.4750, 76.9500],
    'Thiruvallam': [8.4500, 76.9600],
    'Vizhinjam': [8.3800, 76.9900],
    'Balaramapuram': [8.4200, 77.0300],
    'Neyyattinkara': [8.4000, 77.0800],
    'Pothencode': [8.6100, 76.9000],
    'Mangalapuram': [8.6000, 76.8800],
    'Attingal': [8.6900, 76.8100],
    'Kilimanoor': [8.7700, 76.8800],
    'Nedumangad': [8.6000, 77.0000],
    'Venjaramoodu': [8.6700, 76.9500],
    'Malayinkeezhu': [8.5200, 77.0500],
    'Peyad': [8.5300, 77.0300],
    'Ooruttambalam': [8.4800, 77.0500],
    'Pravachambalam': [8.4500, 77.0200],
    'Pallipuram': [8.5800, 76.8700],
    'Technocity': [8.5900, 76.8700],
    'Kaniyapuram': [8.5800, 76.8600],
    'Menamkulam': [8.5700, 76.8700],
    'Thumba': [8.5500, 76.8700],
    'Akkulam': [8.5300, 76.9000],
    'Anayara': [8.5100, 76.9100],
    'Kumarapuram': [8.5200, 76.9300],
    'Kannammoola': [8.5100, 76.9300],
    'Pangappara': [8.5600, 76.9100],
    'Powdikonam': [8.5800, 76.9300],
    'Chenkottukonam': [8.5900, 76.9200],
    'Chanthavila': [8.6000, 76.9100],
    'Karyavattom': [8.5600, 76.8900],
    'Pulayanarkotta': [8.5300, 76.9100],
    'Kuravankonam': [8.5300, 76.9500],
    'Nalanchira': [8.5500, 76.9400],
    'Paruthippara': [8.5550, 76.9450],
    'Muttada': [8.5400, 76.9600],
    'Ambalamukku': [8.5350, 76.9550],
    'Kudappanakunnu': [8.5500, 76.9700],
    'Maruthankuzhy': [8.5150, 76.9750],
    'Vellayambalam': [8.5100, 76.9600],
    'Palayam': [8.5050, 76.9500],
    'Statue': [8.5000, 76.9500],
    'Vanchiyoor': [8.4950, 76.9400],
    'General Hospital': [8.5000, 76.9400],
    'Pattoor': [8.5000, 76.9350],
    'Ambalathara': [8.4600, 76.9500],
    'Beemapally': [8.4700, 76.9300],
    'Shangumugham': [8.4800, 76.9100],
    'Vellayani': [8.4300, 76.9900]
};
const InteractiveMap: React.FC<InteractiveMapProps> = ({ comparables, locality }) => {
    const center = LOCALITY_COORDS[locality] || LOCALITY_COORDS['Trivandrum'];
    // Helper to get random offset for demo markers (to prevent overlap)
    const getOffset = () => (Math.random() - 0.5) * 0.01;
    return (
        <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 z-0 relative">
            <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap center={center} />
                {/* Main Location Marker */}
                <Marker position={center}>
                    <Popup>
                        <div className="text-center">
                            <h3 className="font-bold text-teal-700">{locality}</h3>
                            <p className="text-xs text-gray-500">Selected Location</p>
                        </div>
                    </Popup>
                </Marker>
                {/* Comparable Markers */}
                {comparables.map((comp) => (
                    <Marker
                        key={comp.id}
                        position={[center[0] + getOffset(), center[1] + getOffset()]} // Simulated position near locality
                    >
                        <Popup>
                            <div className="min-w-[200px]">
                                <h4 className="font-bold text-gray-800 text-sm mb-1">{comp.title}</h4>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="bg-teal-100 text-teal-800 text-xs px-2 py-0.5 rounded-full">
                                        {comp.size} cents
                                    </span>
                                    <span className="font-bold text-teal-700">₹{comp.price} L</span>
                                </div>
                                <a
                                    href={comp.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-center w-full bg-teal-600 text-white text-xs py-1.5 rounded hover:bg-teal-700 transition-colors"
                                >
                                    View Listing
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            {/* Legend Overlay */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md z-[1000] text-xs border border-gray-200">
                <h4 className="font-bold text-gray-700 mb-2">Map Legend</h4>
                <div className="flex items-center mb-1">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    <span>Selected Locality</span>
                </div>
                <div className="flex items-center">
                    <span className="w-3 h-3 bg-blue-300 rounded-full mr-2 opacity-75"></span>
                    <span>Comparable Listings</span>
                </div>
            </div>
        </div>
    );
};
export default InteractiveMap;
