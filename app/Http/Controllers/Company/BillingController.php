<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class BillingController extends Controller
{
    public function index(): Response
    {
        $company = $this->currentCompany();
        $subscription = $company->subscription('default');

        return Inertia::render('Company/Billing', [
            'plans' => config('plans'),
            'subscription' => $subscription ? [
                'plan' => $subscription->stripe_price,
                'status' => $subscription->stripe_status,
                'ends_at' => $subscription->ends_at,
                'trial_ends' => $company->trial_ends_at,
            ] : null,
            'currentPlan' => $this->currentPlan($company),
            'onTrial' => $company->onTrial(),
            'onGracePeriod' => $subscription?->onGracePeriod() ?? false,
        ]);
    }

    public function checkout(Request $request): HttpResponse
    {
        $request->validate([
            'plan' => 'required|in:pro,agency',
        ]);

        $company = $this->currentCompany();
        $priceId = config("plans.{$request->plan}.stripe_price");

        $checkout = $company
            ->newSubscription('default', $priceId)
            ->checkout([
                'success_url' => route('company.billing.success'),
                'cancel_url' => route('company.billing').'?cancelled=1',
            ]);

        return Inertia::location($checkout->url);
    }

    public function success(): RedirectResponse
    {
        return redirect()->route('company.billing')
            ->with('success', 'Subscription activated successfully. Welcome to FluxKargo Pro!');
    }

    public function portal(): HttpResponse
    {
        $company = $this->currentCompany();

        $url = $company->billingPortalUrl(route('company.billing'));

        return Inertia::location($url);
    }

    public function cancel(): RedirectResponse
    {
        $company = $this->currentCompany();
        $company->subscription('default')->cancel();

        return redirect()->route('company.billing')
            ->with('success', 'Subscription cancelled. You have access until the end of your billing period.');
    }

    public function resume(): RedirectResponse
    {
        $company = $this->currentCompany();
        $company->subscription('default')->resume();

        return redirect()->route('company.billing')
            ->with('success', 'Subscription resumed successfully.');
    }

    private function currentCompany(): Company
    {
        /** @var User $user */
        $user = Auth::user();

        return $user->company;
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
}
