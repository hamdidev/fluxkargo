<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDriverLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'driver';
    }

    public function rules(): array
    {
        return [
            'lat'         => 'required|numeric|between:-90,90',
            'lng'         => 'required|numeric|between:-180,180',
            'shipment_id' => 'nullable|exists:shipments,id',
            'speed'       => 'nullable|numeric',
            'heading'     => 'nullable|numeric|between:0,360',
        ];
    }
}
