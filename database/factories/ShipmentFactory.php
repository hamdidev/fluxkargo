<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ShipmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tracking_number'     => 'FLX-' . strtoupper(Str::random(4)) . '-' . rand(1000, 9999),
            'company_id'          => Company::factory(),
            'customer_id'         => User::factory(),
            'driver_id'           => null,
            'origin_address'      => fake()->streetAddress(),
            'origin_city'         => fake()->city(),
            'origin_country'      => fake()->country(),
            'origin_lat'          => fake()->latitude(),
            'origin_lng'          => fake()->longitude(),
            'destination_address' => fake()->streetAddress(),
            'destination_city'    => fake()->city(),
            'destination_country' => fake()->country(),
            'destination_lat'     => fake()->latitude(),
            'destination_lng'     => fake()->longitude(),
            'status'              => 'pending',
        ];
    }
}
