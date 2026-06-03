<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreShipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Shipment::class);
    }

    public function rules(): array
    {
        return [
            'customer_id'           => 'required|exists:users,id',
            'driver_id'             => 'nullable|exists:users,id',
            'origin_address'        => 'required|string|max:255',
            'origin_city'           => 'required|string|max:100',
            'origin_country'        => 'required|string|max:100',
            'origin_lat'            => 'nullable|numeric',
            'origin_lng'            => 'nullable|numeric',
            'destination_address'   => 'required|string|max:255',
            'destination_city'      => 'required|string|max:100',
            'destination_country'   => 'required|string|max:100',
            'destination_lat'       => 'nullable|numeric',
            'destination_lng'       => 'nullable|numeric',
            'description'           => 'nullable|string',
            'weight'                => 'nullable|numeric|min:0',
            'price'                 => 'nullable|numeric|min:0',
            'estimated_delivery'    => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'customer_id.required' => 'Please select a customer.',
            'customer_id.exists'   => 'Selected customer does not exist.',
            'origin_city.required' => 'Origin city is required.',
            'destination_city.required' => 'Destination city is required.',
        ];
    }
}
