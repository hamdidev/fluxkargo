<?php

namespace App\Events;

use App\Models\Shipment;
use App\Models\ShipmentStatusLog;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ShipmentStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public string $queue = 'broadcasts';

    public function __construct(
        public Shipment $shipment,
        public ShipmentStatusLog $log,
    ) {
        $this->log->loadMissing('user');
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("shipment.{$this->shipment->id}"),
            new PrivateChannel("company.{$this->shipment->company_id}"),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'shipment_id'     => $this->shipment->id,
            'tracking_number' => $this->shipment->tracking_number,
            'status'          => $this->shipment->status,
            'log'             => [
                'id'          => $this->log->id,
                'from_status' => $this->log->from_status,
                'to_status'   => $this->log->to_status,
                'note'        => $this->log->note,
                'created_at'  => $this->log->created_at,
                'user'        => [
                    'name' => $this->log->user?->name,
                    'role' => $this->log->user?->role,
                ],
            ],
        ];
    }

    public function broadcastAs(): string
    {
        return 'status.updated';
    }
}
