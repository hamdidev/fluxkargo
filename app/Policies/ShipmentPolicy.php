<?php

namespace App\Policies;

use App\Models\Shipment;
use App\Models\User;

class ShipmentPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Shipment $shipment): bool
    {
        return match ($user->role) {
            'super_admin'   => true,
            'company_admin',  'dispatcher' => $shipment->company_id === $user->company_id,

            'driver'        => $shipment->driver_id === $user->id,
            'customer'      => $shipment->customer_id === $user->id,
            default         => false,
        };
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'company_admin',  'dispatcher']);
    }

    public function update(User $user, Shipment $shipment): bool
    {
        return match ($user->role) {
            'super_admin'   => true,
            'company_admin',  'dispatcher' => $shipment->company_id === $user->company_id,
            default         => false,
        };
    }

    public function delete(User $user, Shipment $shipment): bool
    {
        // Cannot delete active shipments
        if (in_array($shipment->status, ['in_transit', 'out_for_delivery', 'picked_up', 'assigned'])) {
            return false;
        }
        return match ($user->role) {
            'super_admin'   => true,
            'company_admin',  'dispatcher' => $shipment->company_id === $user->company_id,
            default         => false,
        };
    }

    public function transition(User $user, Shipment $shipment): bool
    {
        return match ($user->role) {
            'super_admin'   => true,
            'company_admin',  'dispatcher' => $shipment->company_id === $user->company_id,
            'driver'        => $shipment->driver_id === $user->id,
            default         => false,
        };
    }
}
