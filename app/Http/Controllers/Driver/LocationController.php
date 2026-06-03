<?php

namespace App\Http\Controllers\Driver;

use App\Events\DriverLocationUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateDriverLocationRequest;
use App\Models\DriverLocation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function update(UpdateDriverLocationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $location = DriverLocation::create([
            'user_id'     => auth()->id(),
            'shipment_id' => $validated['shipment_id'] ?? null,
            'lat'         => $validated['lat'],
            'lng'         => $validated['lng'],
            'speed'       => $validated['speed'] ?? null,
            'heading'     => $validated['heading'] ?? null,
            'recorded_at' => now(),
        ]);
        $shipment = $validated['shipment_id']
            ? \App\Models\Shipment::find($validated['shipment_id'])
            : null;
        DriverLocationUpdated::dispatch($location, $shipment);
        return response()->json(['status' => 'ok']);
    }
}
