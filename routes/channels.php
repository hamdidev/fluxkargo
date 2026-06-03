<?php

use App\Models\Shipment;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

// Shipment channel
Broadcast::channel('shipment.{shipmentId}', function ($user, $shipmentId) {
    $shipment = Shipment::find($shipmentId);
    if (!$shipment) return false;

    return match ($user->role) {
        'super_admin'   => true,
        'company_admin' => $shipment->company_id === $user->company_id,
        'driver'        => $shipment->driver_id === $user->id,
        'customer'      => $shipment->customer_id === $user->id,
        default         => false,
    };
});

// Company channel — only that company's admin or super admin
Broadcast::channel('company.{companyId}', function ($user, $companyId) {
    if ($user->role === 'super_admin') return true;
    return $user->role === 'company_admin'
        && $user->company_id === (int) $companyId;
});

// Driver channel — only the driver themselves, or admin of SAME company
Broadcast::channel('driver.{driverId}', function ($user, $driverId) {
    if ($user->role === 'super_admin') return true;
    if ($user->id === (int) $driverId) return true;

    if ($user->role === 'company_admin') {
        $driver = User::find($driverId);
        return $driver && $driver->company_id === $user->company_id;
    }

    return false;
});
