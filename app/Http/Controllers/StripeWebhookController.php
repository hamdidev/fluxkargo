<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierWebhookController;

class StripeWebhookController extends CashierWebhookController
{
    public function handleCustomerSubscriptionDeleted(array $payload): void
    {
        parent::handleCustomerSubscriptionDeleted($payload);

        $stripeId = $payload['data']['object']['customer'];
        $company  = Company::where('stripe_id', $stripeId)->first();

        if ($company) {
            $company->update(['status' => 'trial']);
        }
    }

    public function handleCustomerSubscriptionUpdated(array $payload): void
    {
        parent::handleCustomerSubscriptionUpdated($payload);

        $stripeId = $payload['data']['object']['customer'];
        $status   = $payload['data']['object']['status'];
        $company  = Company::where('stripe_id', $stripeId)->first();

        if ($company) {
            $company->update([
                'status' => in_array($status, ['active', 'trialing']) ? 'active' : 'suspended',
            ]);
        }
    }
}
