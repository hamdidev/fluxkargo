<?php

namespace App\Notifications;

use App\Models\Shipment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ShipmentCreated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Shipment $shipment) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Shipment {$this->shipment->tracking_number} Created")
            ->greeting("Hello {$notifiable->name},")
            ->line("Your shipment has been created and is pending pickup.")
            ->line("**Tracking Number:** {$this->shipment->tracking_number}")
            ->line("**From:** {$this->shipment->origin_city}, {$this->shipment->origin_country}")
            ->line("**To:** {$this->shipment->destination_city}, {$this->shipment->destination_country}")
            ->action('Track Shipment', url("/shipments/{$this->shipment->tracking_number}"))
            ->line('Thank you for using FluxKargo.');
    }
}
