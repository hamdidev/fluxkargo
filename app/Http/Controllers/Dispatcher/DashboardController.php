<?php

namespace App\Http\Controllers\Dispatcher;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use App\Models\ShipmentStatusLog;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $companyId = auth()->user()->company_id;

        $stats = [
            'total'      => Shipment::where('company_id', $companyId)->count(),
            'pending'    => Shipment::where('company_id', $companyId)->where('status', 'pending')->count(),
            'in_transit' => Shipment::where('company_id', $companyId)
                ->whereIn('status', ['in_transit', 'out_for_delivery', 'picked_up', 'assigned'])
                ->count(),
            'delivered'  => Shipment::where('company_id', $companyId)->where('status', 'delivered')->count(),
        ];

        $pendingShipments = Shipment::where('company_id', $companyId)
            ->where('status', 'pending')
            ->with(['customer:id,name'])
            ->latest()
            ->take(10)
            ->get();

        $activeShipments = Shipment::where('company_id', $companyId)
            ->whereIn('status', ['assigned', 'picked_up', 'in_transit', 'out_for_delivery'])
            ->with(['driver:id,name', 'customer:id,name'])
            ->latest()
            ->take(10)
            ->get();

        $drivers = User::where('company_id', $companyId)
            ->where('role', 'driver')
            ->where('status', 'active')
            ->select('id', 'name')
            ->get();

        return Inertia::render('Dispatcher/Dashboard', compact(
            'stats',
            'pendingShipments',
            'activeShipments',
            'drivers'
        ));
    }
}
