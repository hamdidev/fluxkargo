<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GeocodingService
{
    public function geocode(string $city, string $country): ?array
    {
        $response = Http::withHeaders([
            'User-Agent' => 'FluxKargo/1.0',
        ])->get('https://nominatim.openstreetmap.org/search', [
            'q'      => "{$city}, {$country}",
            'format' => 'json',
            'limit'  => 1,
        ]);

        if ($response->ok() && count($response->json()) > 0) {
            $result = $response->json()[0];
            return [
                'lat' => (float) $result['lat'],
                'lng' => (float) $result['lon'],
            ];
        }

        return null;
    }
}
