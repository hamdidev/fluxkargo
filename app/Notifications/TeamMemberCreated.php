<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TeamMemberCreated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $password,
        public string $companyName,
    ) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Welcome to {$this->companyName} on FluxKargo")
            ->greeting("Hello {$notifiable->name},")
            ->line("Your account has been created on FluxKargo.")
            ->line("**Email:** {$notifiable->email}")
            ->line("**Temporary Password:** {$this->password}")
            ->action('Login to FluxKargo', url('/login'))
            ->line('Please change your password after your first login.');
    }
}
