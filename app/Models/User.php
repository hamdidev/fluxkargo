<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'phone',
        'password',
        'role',
        'status',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function shipments(): HasMany
    {
        return $this->hasMany(Shipment::class, 'customer_id');
    }

    public function assignedShipments(): HasMany
    {
        return $this->hasMany(Shipment::class, 'driver_id');
    }

    public function driverLocations(): HasMany
    {
        return $this->hasMany(DriverLocation::class);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }
    public function isCompanyAdmin(): bool
    {
        return $this->role === 'company_admin';
    }
    public function isDriver(): bool
    {
        return $this->role === 'driver';
    }
    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }
}
