<?php

namespace Tests\Unit;

use App\Models\Shipment;
use App\Models\ShipmentStatusLog;
use App\Models\User;
use App\Services\ShipmentStateMachine;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class ShipmentStateMachineTest extends TestCase
{
    use RefreshDatabase;

    private ShipmentStateMachine $machine;

    protected function setUp(): void
    {
        parent::setUp();
        $this->machine = new ShipmentStateMachine();
    }

    public function test_can_transition_valid_status(): void
    {
        $this->assertTrue($this->machine->canTransition('pending', 'assigned'));
        $this->assertTrue($this->machine->canTransition('assigned', 'picked_up'));
        $this->assertTrue($this->machine->canTransition('picked_up', 'in_transit'));
        $this->assertTrue($this->machine->canTransition('in_transit', 'out_for_delivery'));
        $this->assertTrue($this->machine->canTransition('out_for_delivery', 'delivered'));
    }

    public function test_cannot_transition_invalid_status(): void
    {
        $this->assertFalse($this->machine->canTransition('pending', 'delivered'));
        $this->assertFalse($this->machine->canTransition('delivered', 'pending'));
        $this->assertFalse($this->machine->canTransition('cancelled', 'assigned'));
    }

    public function test_transition_updates_shipment_status(): void
    {
        $company  = \App\Models\Company::factory()->create();
        $actor    = User::factory()->create(['role' => 'company_admin', 'company_id' => $company->id]);
        $customer = User::factory()->create(['role' => 'customer', 'company_id' => $company->id]);

        $shipment = Shipment::factory()->create([
            'company_id'  => $company->id,
            'customer_id' => $customer->id,
            'status'      => 'pending',
        ]);

        $result = $this->machine->transition($shipment, 'assigned', $actor, 'Test note');

        $this->assertEquals('assigned', $result->status);
        $this->assertDatabaseHas('shipment_status_logs', [
            'shipment_id' => $shipment->id,
            'from_status' => 'pending',
            'to_status'   => 'assigned',
            'note'        => 'Test note',
        ]);
    }

    public function test_transition_throws_on_invalid_transition(): void
    {
        $this->expectException(ValidationException::class);

        $company  = \App\Models\Company::factory()->create();
        $actor    = User::factory()->create(['role' => 'company_admin', 'company_id' => $company->id]);
        $customer = User::factory()->create(['role' => 'customer', 'company_id' => $company->id]);

        $shipment = Shipment::factory()->create([
            'company_id'  => $company->id,
            'customer_id' => $customer->id,
            'status'      => 'delivered',
        ]);

        $this->machine->transition($shipment, 'pending', $actor);
    }

    public function test_delivered_status_sets_delivered_at(): void
    {
        $company  = \App\Models\Company::factory()->create();
        $actor    = User::factory()->create(['role' => 'driver', 'company_id' => $company->id]);
        $customer = User::factory()->create(['role' => 'customer', 'company_id' => $company->id]);

        $shipment = Shipment::factory()->create([
            'company_id'  => $company->id,
            'customer_id' => $customer->id,
            'status'      => 'out_for_delivery',
        ]);

        $result = $this->machine->transition($shipment, 'delivered', $actor);

        $this->assertNotNull($result->delivered_at);
    }

    public function test_allowed_transitions_returns_correct_states(): void
    {
        $this->assertEquals(['assigned', 'cancelled'], $this->machine->allowedTransitions('pending'));
        $this->assertEquals([], $this->machine->allowedTransitions('delivered'));
        $this->assertEquals([], $this->machine->allowedTransitions('cancelled'));
    }
}
