<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $activeShipments = Shipment::where('driver_id', auth()->id())
            ->whereNotIn('status', ['delivered', 'cancelled', 'failed'])
            ->with('customer:id,name')
            ->latest()
            ->get();

        return Inertia::render('Driver/Dashboard', compact('activeShipments'));
    }
}
