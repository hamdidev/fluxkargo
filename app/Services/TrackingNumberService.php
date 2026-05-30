<?php

namespace App\Services;

use App\Models\Shipment;

class TrackingNumberService
{
    public function generate(): string
    {
        do {
            $number = 'FLX-' . strtoupper(substr(md5(uniqid()), 0, 4)) . '-' . random_int(1000, 9999);
        } while (Shipment::where('tracking_number', $number)->exists());

        return $number;
    }
}
