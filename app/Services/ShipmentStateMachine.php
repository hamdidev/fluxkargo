<?php

namespace App\Services;

use App\Models\Shipment;
use App\Models\ShipmentStatusLog;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use App\Events\ShipmentStatusUpdated;

class ShipmentStateMachine
{
    // Allowed transitions: from → to[]
    const TRANSITIONS = [
        'pending'          => ['assigned', 'cancelled'],
        'assigned'         => ['picked_up', 'cancelled'],
        'picked_up'        => ['in_transit'],
        'in_transit'       => ['out_for_delivery', 'failed'],
        'out_for_delivery' => ['delivered', 'failed'],
        'delivered'        => [],
        'failed'           => ['pending'],
        'cancelled'        => [],
    ];

    public function canTransition(string $from, string $to): bool
    {
        return in_array($to, self::TRANSITIONS[$from] ?? []);
    }

    public function transition(Shipment $shipment, string $toStatus, User $actor, ?string $note = null, ?float $lat = null, ?float $lng = null): Shipment
    {
        if (!$this->canTransition($shipment->status, $toStatus)) {
            throw ValidationException::withMessages([
                'status' => "Cannot transition from [{$shipment->status}] to [{$toStatus}].",
            ]);
        }

        $fromStatus = $shipment->status;

        $shipment->update([
            'status'       => $toStatus,
            'delivered_at' => $toStatus === 'delivered' ? now() : $shipment->delivered_at,
        ]);

        $log = ShipmentStatusLog::create([
            'shipment_id' => $shipment->id,
            'user_id'     => $actor->id,
            'from_status' => $fromStatus,
            'to_status'   => $toStatus,
            'note'        => $note,
            'lat'         => $lat,
            'lng'         => $lng,
        ]);

        ShipmentStatusUpdated::dispatch($shipment->fresh(), $log);
        return $shipment->fresh();
    }

    public function allowedTransitions(string $fromStatus): array
    {
        return self::TRANSITIONS[$fromStatus] ?? [];
    }
}
