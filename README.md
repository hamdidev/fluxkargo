# FluxKargo

A multi-tenant SaaS platform for cargo and shipment logistics. Companies manage their fleet, drivers, and shipments end-to-end — from creation through a validated delivery lifecycle — with real-time GPS tracking, customer notifications, public tracking links, and Stripe-based subscription billing.

## Features

- **Multi-tenant companies** — each company manages its own team, drivers, and shipments in isolation.
- **Role-based access** — five roles (`super_admin`, `company_admin`, `dispatcher`, `driver`, `customer`), each with a dedicated dashboard and policy-enforced authorization.
- **Shipment lifecycle** — a state machine enforces valid status transitions (`pending → assigned → picked_up → in_transit → out_for_delivery → delivered`, plus `failed` / `cancelled`), with a full audit log of every change.
- **Real-time tracking** — driver GPS locations and shipment status updates are broadcast over WebSockets via Laravel Reverb and rendered on a Leaflet map.
- **Public tracking** — customers track shipments by tracking number at a public `/track/{tracking_number}` page without logging in.
- **Notifications** — customers and team members receive notifications on shipment creation, status changes, and team invites.
- **Subscription billing** — Trial, Pro, and Agency plans with shipment limits, managed through Laravel Cashier and Stripe (checkout, billing portal, cancel/resume, webhooks).
- **Authentication** — login, registration, password reset, email verification, two-factor authentication, and passkeys via Laravel Fortify.

## Tech Stack

- **Backend:** PHP 8.4, Laravel 13
- **Frontend:** React 19 + TypeScript, Inertia.js v3, Tailwind CSS v4, Radix UI, Leaflet
- **Real-time:** Laravel Reverb (WebSockets), Laravel Echo
- **Billing:** Laravel Cashier (Stripe)
- **Auth:** Laravel Fortify (2FA, passkeys)
- **Routing types:** Laravel Wayfinder (typed route helpers for the frontend)
- **Testing:** Pest v4
- **Tooling:** Vite, ESLint, Prettier, Laravel Pint

## Requirements

- PHP 8.4+
- Composer
- Node.js & npm
- A database (SQLite by default; MySQL/PostgreSQL supported)
- Redis (optional, for queues/broadcasting at scale)

## Installation

```bash
# Install dependencies, copy .env, generate key, migrate, and build assets
composer setup
```

The `composer setup` script runs `composer install`, copies `.env.example` to `.env`, generates the app key, runs migrations, and builds the frontend. If you prefer to do it manually:

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite   # if using SQLite
php artisan migrate
npm install
npm run build
```

### Stripe (billing)

Set your Stripe keys and price IDs in `.env` to enable subscriptions:

```env
STRIPE_KEY=
STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO=
STRIPE_PRICE_AGENCY=
```

Plans (price, shipment limits, features) are defined in [config/plans.php](config/plans.php).

## Development

Run the full development stack — PHP server, queue worker, log viewer, and Vite — with a single command:

```bash
composer dev
```

To run the WebSocket server for real-time tracking:

```bash
php artisan reverb:start
```

## Testing

```bash
php artisan test --compact
```

The full CI check (lint, format, types, tests) can be run with:

```bash
composer ci:check
```

## Project Structure

- `app/Http/Controllers/` — controllers grouped by role (`SuperAdmin/`, `Company/`, `Driver/`, `Dispatcher/`, `Customer/`) plus `ShipmentController`, `TrackingController`, and the Stripe webhook handler.
- `app/Services/ShipmentStateMachine.php` — the shipment status transition rules and logging.
- `app/Models/` — `Company`, `User`, `Shipment`, `ShipmentStatusLog`, `DriverLocation`.
- `app/Events/` & `app/Notifications/` — broadcast events and user notifications.
- `resources/js/pages/` — Inertia React pages, organized by role.
- `routes/web.php` — application routes; `routes/settings.php` — profile/security settings.

## License

MIT
