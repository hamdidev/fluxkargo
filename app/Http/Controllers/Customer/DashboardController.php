<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $userId = auth()->id();

        $shipments = Shipment::where('customer_id', $userId)
            ->latest()
            ->take(10)
            ->get();

        $stats = [
            'total'      => Shipment::where('customer_id', $userId)->count(),
            'pending'    => Shipment::where('customer_id', $userId)->where('status', 'pending')->count(),
            'in_transit' => Shipment::where('customer_id', $userId)->whereIn('status', ['in_transit', 'out_for_delivery', 'picked_up'])->count(),
            'delivered'  => Shipment::where('customer_id', $userId)->where('status', 'delivered')->count(),
        ];

        return Inertia::render('Customer/Dashboard', compact('shipments', 'stats'));
    }
}
