<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BillingControllerTest extends TestCase
{
    use RefreshDatabase;

    private Company $company;

    private User $admin;

    private User $customer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company  = Company::factory()->create(['status' => 'active']);
        $this->admin    = User::factory()->create(['role' => 'company_admin', 'company_id' => $this->company->id, 'status' => 'active']);
        $this->customer = User::factory()->create(['role' => 'customer', 'company_id' => $this->company->id, 'status' => 'active']);
    }

    public function test_company_admin_can_view_billing_page(): void
    {
        $this->actingAs($this->admin)
            ->get('/company/billing')
            ->assertOk();
    }

    public function test_guest_cannot_view_billing_page(): void
    {
        $this->get('/company/billing')->assertRedirect('/login');
    }

    public function test_non_admin_cannot_access_checkout(): void
    {
        $this->actingAs($this->customer)
            ->post('/company/billing/checkout', ['plan' => 'pro'])
            ->assertForbidden();
    }

    public function test_checkout_rejects_invalid_plan(): void
    {
        $this->actingAs($this->admin)
            ->post('/company/billing/checkout', ['plan' => 'free'])
            ->assertSessionHasErrors('plan');
    }

    public function test_checkout_returns_inertia_external_redirect_to_stripe(): void
    {
        if (! config('plans.pro.stripe_price')) {
            $this->markTestSkipped('STRIPE_PRICE_PRO is not configured.');
        }

        $response = $this->actingAs($this->admin)
            ->withHeaders(['X-Inertia' => 'true'])
            ->post('/company/billing/checkout', ['plan' => 'pro']);

        // Inertia external redirects use a 409 + X-Inertia-Location header so the
        // client performs a full-page visit to Stripe (a plain 302 would be
        // swallowed by Inertia's XHR and never navigate the browser).
        $response->assertStatus(409);
        $this->assertStringContainsString(
            'checkout.stripe.com',
            $response->headers->get('X-Inertia-Location'),
        );
    }
}
