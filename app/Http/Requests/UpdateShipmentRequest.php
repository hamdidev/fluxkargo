<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('shipment'));
    }

    public function rules(): array
    {
        return [
            'driver_id'             => 'nullable|exists:users,id',
            'origin_address'        => 'required|string|max:255',
            'origin_city'           => 'required|string|max:100',
            'origin_country'        => 'required|string|max:100',
            'destination_address'   => 'required|string|max:255',
            'destination_city'      => 'required|string|max:100',
            'destination_country'   => 'required|string|max:100',
            'description'           => 'nullable|string',
            'weight'                => 'nullable|numeric|min:0',
            'price'                 => 'nullable|numeric|min:0',
            'estimated_delivery'    => 'nullable|date',
        ];
    }
}
