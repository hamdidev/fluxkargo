<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Shipment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShipmentControllerTest extends TestCase
{
    use RefreshDatabase;

    private Company $company;
    private User $admin;
    private User $customer;
    private User $driver;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company  = Company::factory()->create(['status' => 'active']);
        $this->admin    = User::factory()->create(['role' => 'company_admin', 'company_id' => $this->company->id, 'status' => 'active']);
        $this->customer = User::factory()->create(['role' => 'customer',      'company_id' => $this->company->id, 'status' => 'active']);
        $this->driver   = User::factory()->create(['role' => 'driver',        'company_id' => $this->company->id, 'status' => 'active']);
    }

    public function test_company_admin_can_view_shipments(): void
    {
        Shipment::factory()->count(3)->create([
            'company_id'  => $this->company->id,
            'customer_id' => $this->customer->id,
        ]);

        $response = $this->actingAs($this->admin)->get('/shipments');
        $response->assertOk();
    }

    public function test_company_admin_can_create_shipment(): void
    {
        $response = $this->actingAs($this->admin)->post('/shipments', [
            'customer_id'         => $this->customer->id,
            'origin_address'      => '123 Test St',
            'origin_city'         => 'Istanbul',
            'origin_country'      => 'Turkey',
            'destination_address' => '456 Test Ave',
            'destination_city'    => 'Berlin',
            'destination_country' => 'Germany',
        ]);

        $response->assertRedirect('/shipments');
        $this->assertDatabaseHas('shipments', [
            'company_id'  => $this->company->id,
            'customer_id' => $this->customer->id,
            'status'      => 'pending',
        ]);
    }

    public function test_customer_cannot_create_shipment(): void
    {
        $response = $this->actingAs($this->customer)->post('/shipments', [
            'customer_id'         => $this->customer->id,
            'origin_address'      => '123 Test St',
            'origin_city'         => 'Istanbul',
            'origin_country'      => 'Turkey',
            'destination_address' => '456 Test Ave',
            'destination_city'    => 'Berlin',
            'destination_country' => 'Germany',
        ]);

        $response->assertForbidden();
    }

    public function test_driver_can_only_see_assigned_shipments(): void
    {
        $assignedShipment = Shipment::factory()->create([
            'company_id'  => $this->company->id,
            'customer_id' => $this->customer->id,
            'driver_id'   => $this->driver->id,
        ]);

        $otherShipment = Shipment::factory()->create([
            'company_id'  => $this->company->id,
            'customer_id' => $this->customer->id,
            'driver_id'   => null,
        ]);

        $response = $this->actingAs($this->driver)->get('/shipments');
        $response->assertOk();

        $data = $response->original->getData()['page']['props']['shipments']['data'];
        $ids = collect($data)->pluck('id');

        $this->assertContains($assignedShipment->id, $ids);
        $this->assertNotContains($otherShipment->id, $ids);
    }

    public function test_company_admin_can_delete_shipment(): void
    {
        $shipment = Shipment::factory()->create([
            'company_id'  => $this->company->id,
            'customer_id' => $this->customer->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->delete("/shipments/{$shipment->tracking_number}");

        $response->assertRedirect('/shipments');
        $this->assertSoftDeleted('shipments', ['id' => $shipment->id]);
    }

    public function test_admin_cannot_delete_other_company_shipment(): void
    {
        $otherCompany  = Company::factory()->create(['status' => 'active']);
        $otherCustomer = User::factory()->create(['role' => 'customer', 'company_id' => $otherCompany->id, 'status' => 'active']);

        $shipment = Shipment::factory()->create([
            'company_id'  => $otherCompany->id,
            'customer_id' => $otherCustomer->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->delete("/shipments/{$shipment->tracking_number}");

        $response->assertForbidden();
    }
    public function test_cannot_delete_active_shipment(): void
    {
        $shipment = Shipment::factory()->create([
            'company_id'  => $this->company->id,
            'customer_id' => $this->customer->id,
            'status'      => 'in_transit',
        ]);

        $response = $this->actingAs($this->admin)
            ->delete("/shipments/{$shipment->tracking_number}");

        $response->assertRedirect();
        $response->assertSessionHas('error');
        $this->assertNotSoftDeleted('shipments', ['id' => $shipment->id]);
    }
}
