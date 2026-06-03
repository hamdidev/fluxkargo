<?php

namespace App\Events;

use App\Models\DriverLocation;
use App\Models\Shipment;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DriverLocationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public string $queue = 'broadcasts';

    public function __construct(
        public DriverLocation $location,
        public ?Shipment $shipment = null,
    ) {}

    public function broadcastOn(): array
    {
        $channels = [
            new PrivateChannel("driver.{$this->location->user_id}"),
        ];

        if ($this->shipment) {
            $channels[] = new PrivateChannel("shipment.{$this->shipment->id}");
            $channels[] = new PrivateChannel("company.{$this->shipment->company_id}");
        }

        return $channels;
    }

    public function broadcastWith(): array
    {
        return [
            'driver_id'   => $this->location->user_id,
            'shipment_id' => $this->location->shipment_id,
            'lat'         => $this->location->lat,
            'lng'         => $this->location->lng,
            'speed'       => $this->location->speed,
            'heading'     => $this->location->heading,
            'recorded_at' => $this->location->recorded_at,
        ];
    }

    public function broadcastAs(): string
    {
        return 'location.updated';
    }
}
