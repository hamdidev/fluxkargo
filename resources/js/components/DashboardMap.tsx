import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
} from 'react-leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface Shipment {
    id: number;
    tracking_number: string;
    origin_lat: number;
    origin_lng: number;
    destination_lat: number;
    destination_lng: number;
    origin_city: string;
    destination_city: string;
    status: string;
}

interface Props {
    shipments: Shipment[];
}

const originIcon = new L.DivIcon({
    html: `<div style="width:10px;height:10px;border-radius:50%;background:#6366f1;border:2px solid white;box-shadow:0 0 4px rgba(99,102,241,0.6)"></div>`,
    className: '',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
});

const destIcon = new L.DivIcon({
    html: `<div style="width:10px;height:10px;border-radius:50%;background:#10b981;border:2px solid white;box-shadow:0 0 4px rgba(16,185,129,0.6)"></div>`,
    className: '',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
});

function FitBounds({ positions }: { positions: [number, number][] }) {
    const map = useMap();
    useEffect(() => {
        if (positions.length > 0) {
            map.fitBounds(positions, { padding: [20, 20] });
        }
    }, []);
    return null;
}

export default function DashboardMap({ shipments }: Props) {
    const validShipments = shipments.filter(
        (s) =>
            s.origin_lat &&
            s.origin_lng &&
            s.destination_lat &&
            s.destination_lng,
    );

    const allPositions: [number, number][] = validShipments.flatMap((s) => [
        [s.origin_lat, s.origin_lng],
        [s.destination_lat, s.destination_lng],
    ]);

    if (validShipments.length === 0) {
        return (
            <div className="flex h-full items-center justify-center bg-slate-50">
                <p className="font-mono text-xs text-slate-400">
                    No coordinates available
                </p>
            </div>
        );
    }

    return (
        <MapContainer
            center={[
                validShipments[0].origin_lat,
                validShipments[0].origin_lng,
            ]}
            zoom={5}
            className="h-full w-full"
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FitBounds positions={allPositions} />

            {validShipments.map((s) => (
                <div key={s.id}>
                    <Polyline
                        positions={[
                            [s.origin_lat, s.origin_lng],
                            [s.destination_lat, s.destination_lng],
                        ]}
                        pathOptions={{
                            color: '#6366f1',
                            weight: 2,
                            dashArray: '4 3',
                            opacity: 0.6,
                        }}
                    />
                    <Marker
                        position={[s.origin_lat, s.origin_lng]}
                        icon={originIcon}
                    >
                        <Popup>
                            <div className="text-xs font-bold">
                                {s.tracking_number}
                            </div>
                            <div className="text-xs">From: {s.origin_city}</div>
                        </Popup>
                    </Marker>
                    <Marker
                        position={[s.destination_lat, s.destination_lng]}
                        icon={destIcon}
                    >
                        <Popup>
                            <div className="text-xs font-bold">
                                {s.tracking_number}
                            </div>
                            <div className="text-xs">
                                To: {s.destination_city}
                            </div>
                        </Popup>
                    </Marker>
                </div>
            ))}
        </MapContainer>
    );
}
