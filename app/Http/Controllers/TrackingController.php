<?php

namespace App\Http\Controllers;

use App\Models\DriverLocation;
use App\Models\Shipment;
use Inertia\Inertia;
use Inertia\Response;

class TrackingController extends Controller
{
    public function show(string $tracking_number): Response
    {
        $shipment = Shipment::where('tracking_number', $tracking_number)
            ->with([
                'statusLogs' => fn ($q) => $q->with('user:id,name,role')->latest(),
                'company:id,name',
            ])
            ->firstOrFail();

        $latestDriverLocation = $shipment->driver_id
            ? DriverLocation::where('user_id', $shipment->driver_id)
                ->where('shipment_id', $shipment->id)
                ->latest('recorded_at')
                ->first(['lat', 'lng', 'recorded_at'])
            : null;

        return Inertia::render('Tracking/Show', [
            'shipment' => [
                'tracking_number' => $shipment->tracking_number,
                'status' => $shipment->status,
                'origin_city' => $shipment->origin_city,
                'origin_country' => $shipment->origin_country,
                'origin_lat' => $shipment->origin_lat,
                'origin_lng' => $shipment->origin_lng,
                'destination_city' => $shipment->destination_city,
                'destination_country' => $shipment->destination_country,
                'destination_lat' => $shipment->destination_lat,
                'destination_lng' => $shipment->destination_lng,
                'estimated_delivery' => $shipment->estimated_delivery,
                'delivered_at' => $shipment->delivered_at,
                'company' => $shipment->company->name,
                'current_status_log' => $shipment->statusLogs->first() ? [
                    'to_status' => $shipment->statusLogs->first()->to_status,
                    'note' => $shipment->statusLogs->first()->note,
                    'created_at' => $shipment->statusLogs->first()->created_at,
                ] : null,
            ],
            'latest_driver_location' => $latestDriverLocation,
        ]);
    }
}
