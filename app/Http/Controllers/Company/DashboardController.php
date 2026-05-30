<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use App\Models\ShipmentStatusLog;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $companyId = $user->company_id;

        $stats = [
            'total'      => Shipment::where('company_id', $companyId)->count(),
            'in_transit' => Shipment::where('company_id', $companyId)
                ->whereIn('status', ['in_transit', 'out_for_delivery', 'picked_up'])
                ->count(),
            'delivered'  => Shipment::where('company_id', $companyId)
                ->where('status', 'delivered')
                ->count(),
            'exceptions' => Shipment::where('company_id', $companyId)
                ->whereIn('status', ['failed', 'cancelled'])
                ->count(),
        ];

        $recentShipments = Shipment::where('company_id', $companyId)
            ->with(['customer:id,name', 'driver:id,name'])
            ->latest()
            ->take(5)
            ->get();

        $activities = ShipmentStatusLog::whereHas('shipment', fn($q) => $q->where('company_id', $companyId))
            ->with([
                'user:id,name,role',
                'shipment:id,tracking_number',
            ])
            ->latest()
            ->take(10)
            ->get();
        $activeShipments = Shipment::where('company_id', $companyId)
            ->whereNotNull('origin_lat')
            ->whereNotNull('destination_lat')
            ->whereNotIn('status', ['delivered', 'cancelled', 'failed'])
            ->select([
                'id',
                'tracking_number',
                'status',
                'origin_lat',
                'origin_lng',
                'origin_city',
                'destination_lat',
                'destination_lng',
                'destination_city',
            ])
            ->latest()
            ->take(20)
            ->get();

        return Inertia::render('Company/Dashboard', compact('stats', 'recentShipments', 'activities', 'activeShipments'));
    }
}
