<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Shipment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class ChannelAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    private Company $company;

    private Company $otherCompany;

    private User $admin;

    private User $driver;

    private User $customer;

    private User $otherAdmin;

    private User $otherDriver;

    private Shipment $shipment;

    protected function setUp(): void
    {
        parent::setUp();

        // The testing environment boots with BROADCAST_CONNECTION=null, so the
        // channel definitions in routes/channels.php were registered against the
        // null broadcaster (whose auth() is a no-op). Switch to the reverb
        // broadcaster — which performs real authorization — and re-bind the
        // channel callbacks onto it so they are actually evaluated.
        config(['broadcasting.default' => 'reverb']);
        require base_path('routes/channels.php');

        $this->company = Company::factory()->create(['status' => 'active']);
        $this->otherCompany = Company::factory()->create(['status' => 'active']);

        $this->admin = User::factory()->create(['role' => 'company_admin', 'company_id' => $this->company->id,      'status' => 'active']);
        $this->driver = User::factory()->create(['role' => 'driver',        'company_id' => $this->company->id,      'status' => 'active']);
        $this->customer = User::factory()->create(['role' => 'customer',      'company_id' => $this->company->id,      'status' => 'active']);
        $this->otherAdmin = User::factory()->create(['role' => 'company_admin', 'company_id' => $this->otherCompany->id, 'status' => 'active']);
        $this->otherDriver = User::factory()->create(['role' => 'driver',        'company_id' => $this->otherCompany->id, 'status' => 'active']);

        $this->shipment = Shipment::factory()->create([
            'company_id' => $this->company->id,
            'customer_id' => $this->customer->id,
            'driver_id' => $this->driver->id,
        ]);
    }

    /**
     * Authenticate against a private broadcast channel as the given user.
     *
     * A valid socket_id is required so the reverb broadcaster can generate
     * the authentication signature for channels the user is allowed on.
     */
    private function authorizeChannel(User $user, string $channel): TestResponse
    {
        return $this->actingAs($user)->post('/broadcasting/auth', [
            'channel_name' => $channel,
            'socket_id' => '123456.7890',
        ]);
    }

    // Shipment channel
    public function test_company_admin_can_access_own_shipment_channel(): void
    {
        $this->authorizeChannel($this->admin, "private-shipment.{$this->shipment->id}")
            ->assertOk();
    }

    public function test_other_company_admin_cannot_access_shipment_channel(): void
    {
        $this->authorizeChannel($this->otherAdmin, "private-shipment.{$this->shipment->id}")
            ->assertForbidden();
    }

    public function test_driver_can_access_assigned_shipment_channel(): void
    {
        $this->authorizeChannel($this->driver, "private-shipment.{$this->shipment->id}")
            ->assertOk();
    }

    // Driver channel
    public function test_admin_can_access_own_company_driver_channel(): void
    {
        $this->authorizeChannel($this->admin, "private-driver.{$this->driver->id}")
            ->assertOk();
    }

    public function test_other_company_admin_cannot_access_driver_channel(): void
    {
        $this->authorizeChannel($this->otherAdmin, "private-driver.{$this->driver->id}")
            ->assertForbidden();
    }

    // Company channel
    public function test_admin_can_access_own_company_channel(): void
    {
        $this->authorizeChannel($this->admin, "private-company.{$this->company->id}")
            ->assertOk();
    }

    public function test_other_company_admin_cannot_access_company_channel(): void
    {
        $this->authorizeChannel($this->otherAdmin, "private-company.{$this->company->id}")
            ->assertForbidden();
    }
}
