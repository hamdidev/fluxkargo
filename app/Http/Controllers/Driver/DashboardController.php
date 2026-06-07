<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use App\Services\ShipmentStateMachine;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private ShipmentStateMachine $stateMachine) {}

    public function index(): Response
    {
        $activeShipments = Shipment::where('driver_id', auth()->id())
            ->whereNotIn('status', ['delivered', 'cancelled', 'failed'])
            ->with('customer:id,name')
            ->latest()
            ->get()
            ->map(fn($s) => [
                'id'                  => $s->id,
                'tracking_number'     => $s->tracking_number,
                'status'              => $s->status,
                'origin_city'         => $s->origin_city,
                'destination_city'    => $s->destination_city,
                'customer'            => $s->customer,
                'allowed_transitions' => $this->stateMachine->allowedTransitions($s->status),
            ]);

        return Inertia::render('Driver/Dashboard', compact('activeShipments'));
    }
}
