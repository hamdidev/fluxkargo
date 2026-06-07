<?php

namespace App\Notifications;

use App\Models\Shipment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ShipmentStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Shipment $shipment,
        public string $oldStatus,
        public string $newStatus,
    ) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject("Shipment {$this->shipment->tracking_number} — " . ucfirst(str_replace('_', ' ', $this->newStatus)))
            ->greeting("Hello {$notifiable->name},")
            ->line("Your shipment status has been updated.")
            ->line("**Tracking Number:** {$this->shipment->tracking_number}")
            ->line("**Status:** " . ucfirst(str_replace('_', ' ', $this->newStatus)));

        if ($this->newStatus === 'delivered') {
            $message->line("Your shipment has been delivered. Thank you for using FluxKargo!");
        } elseif ($this->newStatus === 'out_for_delivery') {
            $message->line("Your shipment is out for delivery today.");
        }

        return $message
            ->action('Track Shipment', url("/shipments/{$this->shipment->tracking_number}"))
            ->line('Thank you for using FluxKargo.');
    }

    public function toDatabase($notifiable): array
    {
        return [
            'shipment_id'     => $this->shipment->id,
            'tracking_number' => $this->shipment->tracking_number,
            'old_status'      => $this->oldStatus,
            'new_status'      => $this->newStatus,
            'message'         => "Shipment {$this->shipment->tracking_number} is now " . str_replace('_', ' ', $this->newStatus),
        ];
    }
}
