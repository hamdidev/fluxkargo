import { useEffect, useRef } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
} from 'react-leaflet';
import L from 'leaflet';

interface DriverLocation {
    lat: number;
    lng: number;
    recorded_at: string;
}

interface Props {
    originLat: number;
    originLng: number;
    originCity: string;
    destinationLat: number;
    destinationLng: number;
    destinationCity: string;
    driverLocation?: DriverLocation | null;
    status: string;
}

// Custom icons
const originIcon = new L.DivIcon({
    html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border-2 border-white shadow-lg text-white text-xs font-bold">A</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

const destinationIcon = new L.DivIcon({
    html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 border-2 border-white shadow-lg text-white text-xs font-bold">B</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

const driverIcon = new L.DivIcon({
    html: `<div class="relative flex items-center justify-center">
        <div class="w-4 h-4 rounded-full bg-indigo-500 border-2 border-white shadow-lg z-10"></div>
    </div>`,
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

// Auto-fit bounds
function FitBounds({ positions }: { positions: [number, number][] }) {
    const map = useMap();
    useEffect(() => {
        if (positions.length > 0) {
            map.fitBounds(positions, { padding: [40, 40] });
        }
    }, [positions]);
    return null;
}

export default function ShipmentMap({
    originLat,
    originLng,
    originCity,
    destinationLat,
    destinationLng,
    destinationCity,
    driverLocation,
    status,
}: Props) {
    const positions: [number, number][] = [
        [originLat, originLng],
        [destinationLat, destinationLng],
    ];

    if (driverLocation) {
        positions.push([driverLocation.lat, driverLocation.lng]);
    }

    const routeLine: [number, number][] = [
        [originLat, originLng],
        [destinationLat, destinationLng],
    ];

    return (
        <MapContainer
            center={[originLat, originLng]}
            zoom={6}
            className="h-full w-full"
            zoomControl={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FitBounds positions={positions} />

            {/* Route line */}
            <Polyline
                positions={routeLine}
                pathOptions={{ color: '#6366f1', weight: 3, dashArray: '6 4' }}
            />

            {/* Origin marker */}
            <Marker position={[originLat, originLng]} icon={originIcon}>
                <Popup>
                    <div className="text-xs font-bold">Origin</div>
                    <div className="text-xs">{originCity}</div>
                </Popup>
            </Marker>

            {/* Destination marker */}
            <Marker
                position={[destinationLat, destinationLng]}
                icon={destinationIcon}
            >
                <Popup>
                    <div className="text-xs font-bold">Destination</div>
                    <div className="text-xs">{destinationCity}</div>
                </Popup>
            </Marker>

            {/* Live driver marker */}
            {driverLocation && (
                <Marker
                    position={[driverLocation.lat, driverLocation.lng]}
                    icon={driverIcon}
                >
                    <Popup>
                        <div className="text-xs font-bold">Driver</div>
                        <div className="text-xs">
                            {new Date(
                                driverLocation.recorded_at,
                            ).toLocaleTimeString()}
                        </div>
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
}
