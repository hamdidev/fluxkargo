<?php

namespace App\Http\Requests;

use App\Services\ShipmentStateMachine;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TransitionShipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('transition', $this->route('shipment'));
    }

    public function rules(): array
    {
        $shipment = $this->route('shipment');
        $allowed  = ShipmentStateMachine::TRANSITIONS[$shipment->status] ?? [];

        return [
            'status' => ['required', 'string', Rule::in($allowed)],
            'note'   => 'nullable|string|max:500',
            'lat'    => 'nullable|numeric|between:-90,90',
            'lng'    => 'nullable|numeric|between:-180,180',
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Invalid status transition.',
        ];
    }
}
