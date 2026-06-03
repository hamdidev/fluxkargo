<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShipmentRequest;
use App\Http\Requests\TransitionShipmentRequest;
use App\Http\Requests\UpdateShipmentRequest;
use App\Models\Shipment;
use App\Models\ShipmentStatusLog;
use App\Models\User;
use App\Services\GeocodingService;
use App\Services\ShipmentStateMachine;
use App\Services\TrackingNumberService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShipmentController extends Controller
{
    public function __construct(


        private GeocodingService $geocodingService,
        private ShipmentStateMachine $stateMachine,
        private TrackingNumberService $trackingService,
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();


        $shipments = Shipment::query()
            ->when($user->isCompanyAdmin(), fn($q) => $q->where('company_id', $user->company_id))
            ->when($user->isDriver(),       fn($q) => $q->where('driver_id', $user->id))
            ->when($user->isCustomer(),     fn($q) => $q->where('customer_id', $user->id))
            ->when($request->search,        fn($q, $v) => $q->where(function ($q) use ($v) {
                $q->where('tracking_number', 'ilike', "%{$v}%")
                    ->orWhere('origin_city', 'ilike', "%{$v}%")
                    ->orWhere('destination_city', 'ilike', "%{$v}%");
            }))
            ->when($request->status && $request->status !== 'all', fn($q) => $q->where('status', $request->status))
            ->when($request->driver_id && $request->driver_id !== 'all', fn($q) => $q->where('driver_id', $request->driver_id))
            ->when($request->timeframe === 'today',  fn($q) => $q->where('created_at', '>=', now()->subDay()))
            ->when($request->timeframe === 'week',   fn($q) => $q->where('created_at', '>=', now()->subWeek()))
            ->when($request->timeframe === 'month',  fn($q) => $q->where('created_at', '>=', now()->subMonth()))
            ->with(['customer:id,name', 'driver:id,name'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $drivers = $user->isCompanyAdmin()
            ? User::where('company_id', $user->company_id)->where('role', 'driver')->select('id', 'name')->get()
            : collect();

        return Inertia::render('Shipments/Index', [
            'shipments' => $shipments,
            'filters'   => $request->only(['search', 'status', 'timeframe', 'driver_id']),
            'drivers'   => $drivers,
        ]);
    }



    public function store(StoreShipmentRequest $request): RedirectResponse
    {
        $this->authorize('create', Shipment::class);

        $validated = $request->validated();
        if (empty($validated['origin_lat'])) {
            $coords = $this->geocodingService->geocode(
                $validated['origin_city'],
                $validated['origin_country']
            );
            if ($coords) {
                $validated['origin_lat'] = $coords['lat'];
                $validated['origin_lng'] = $coords['lng'];
            }
        }

        if (empty($validated['destination_lat'])) {
            $coords = $this->geocodingService->geocode(
                $validated['destination_city'],
                $validated['destination_country']
            );
            if ($coords) {
                $validated['destination_lat'] = $coords['lat'];
                $validated['destination_lng'] = $coords['lng'];
            }
        }

        $shipment = Shipment::create([
            ...$validated,
            'company_id'       => auth()->user()->company_id,
            'tracking_number'  => $this->trackingService->generate(),
            'status'           => 'pending',
        ]);

        // Log initial status
        ShipmentStatusLog::create([
            'shipment_id' => $shipment->id,
            'user_id'     => auth()->id(),
            'from_status' => null,
            'to_status'   => 'pending',
            'note'        => 'Shipment created.',
        ]);

        return redirect()->route('shipments.index')
            ->with('success', 'Shipment created successfully.');
    }

    public function show(Shipment $shipment): Response
    {
        $this->authorize('view', $shipment);

        $shipment->load([
            'customer:id,name,email,phone',
            'driver:id,name,email,phone',
            'company:id,name',
            'statusLogs.user:id,name,role',
        ]);

        // Get latest driver location
        $latestDriverLocation = $shipment->driver_id
            ? \App\Models\DriverLocation::where('user_id', $shipment->driver_id)
            ->where('shipment_id', $shipment->id)
            ->latest('recorded_at')
            ->first(['lat', 'lng', 'recorded_at'])
            : null;

        $shipment->latest_driver_location = $latestDriverLocation;

        return Inertia::render('Shipments/Show', [
            'shipment'           => $shipment,
            'allowedTransitions' => $this->stateMachine->allowedTransitions($shipment->status),
        ]);
    }

    public function update(UpdateShipmentRequest $request, Shipment $shipment): RedirectResponse
    {
        $this->authorize('update', $shipment);

        $shipment->update($request->validated());

        return redirect()->route('shipments.show', $shipment)
            ->with('success', 'Shipment updated.');
    }

    public function destroy(Shipment $shipment): RedirectResponse
    {
        $this->authorize('delete', $shipment);

        $shipment->delete();

        return redirect()->route('shipments.index')
            ->with('success', 'Shipment deleted.');
    }

    public function transition(TransitionShipmentRequest $request, Shipment $shipment): RedirectResponse
    {
        $this->authorize('transition', $shipment);

        $validated = $request->validated();

        $this->stateMachine->transition(
            $shipment,
            $validated['status'],
            $request->user(),
            $validated['note'] ?? null,
            $validated['lat'] ?? null,
            $validated['lng'] ?? null,
        );

        return redirect()->route('shipments.show', $shipment)
            ->with('success', 'Status updated.');
    }
}
