<?php

namespace App\Http\Requests;

use App\Models\Company;
use App\Models\Shipment;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StoreShipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User $user */
        $user = $this->user();
        $company = $user->company;

        if (! $user->can('create', Shipment::class)) {
            return false;
        }

        $plan = $this->currentPlan($company);
        $limit = config("plans.{$plan}.shipment_limit");

        if ($limit !== null) {
            $count = Shipment::where('company_id', $company->id)->count();

            if ($count >= $limit) {
                return false;
            }
        }

        return true;
    }

    private function currentPlan(Company $company): string
    {
        if ($company->onTrial()) {
            return 'trial';
        }

        $subscription = $company->subscription('default');

        if (! $subscription || ! $subscription->active()) {
            return 'trial';
        }

        $priceId = $subscription->stripe_price;

        foreach (['pro', 'agency'] as $plan) {
            if (config("plans.{$plan}.stripe_price") === $priceId) {
                return $plan;
            }
        }

        return 'trial';
    }

    public function rules(): array
    {
        return [
            'customer_id' => 'required|exists:users,id',
            'driver_id' => 'nullable|exists:users,id',
            'origin_address' => 'required|string|max:255',
            'origin_city' => 'required|string|max:100',
            'origin_country' => 'required|string|max:100',
            'origin_lat' => 'nullable|numeric',
            'origin_lng' => 'nullable|numeric',
            'destination_address' => 'required|string|max:255',
            'destination_city' => 'required|string|max:100',
            'destination_country' => 'required|string|max:100',
            'destination_lat' => 'nullable|numeric',
            'destination_lng' => 'nullable|numeric',
            'description' => 'nullable|string',
            'weight' => 'nullable|numeric|min:0',
            'price' => 'nullable|numeric|min:0',
            'estimated_delivery' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'customer_id.required' => 'Please select a customer.',
            'customer_id.exists' => 'Selected customer does not exist.',
            'origin_city.required' => 'Origin city is required.',
            'destination_city.required' => 'Destination city is required.',
        ];
    }
}
