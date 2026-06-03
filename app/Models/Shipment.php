<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shipment extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'tracking_number',
        'company_id',
        'customer_id',
        'driver_id',
        'origin_address',
        'origin_city',
        'origin_country',
        'origin_lat',
        'origin_lng',
        'destination_address',
        'destination_city',
        'destination_country',
        'destination_lat',
        'destination_lng',
        'status',
        'description',
        'weight',
        'price',
        'estimated_delivery',
        'delivered_at',
    ];

    protected $casts = [
        'estimated_delivery' => 'datetime',
        'delivered_at'       => 'datetime',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function statusLogs(): HasMany
    {
        return $this->hasMany(ShipmentStatusLog::class);
    }

    public function driverLocations(): HasMany
    {
        return $this->hasMany(DriverLocation::class);
    }
    public function getRouteKeyName(): string
    {
        return 'tracking_number';
    }
}
