<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\DriverLocation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lat'         => 'required|numeric|between:-90,90',
            'lng'         => 'required|numeric|between:-180,180',
            'shipment_id' => 'nullable|exists:shipments,id',
            'speed'       => 'nullable|numeric',
            'heading'     => 'nullable|numeric',
        ]);

        DriverLocation::create([
            'user_id'     => auth()->id(),
            'shipment_id' => $validated['shipment_id'] ?? null,
            'lat'         => $validated['lat'],
            'lng'         => $validated['lng'],
            'speed'       => $validated['speed'] ?? null,
            'heading'     => $validated['heading'] ?? null,
            'recorded_at' => now(),
        ]);

        return response()->json(['status' => 'ok']);
    }
}
