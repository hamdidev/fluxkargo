<?php

return [
    'trial' => [
        'name'           => 'Trial',
        'price'          => 0,
        'currency'       => 'EUR',
        'shipment_limit' => 10,
        'features'       => ['Up to 10 shipments', '1 driver', 'Basic tracking'],
    ],
    'pro' => [
        'name'           => 'Pro',
        'price'          => 12,
        'currency'       => 'EUR',
        'stripe_price'   => env('STRIPE_PRICE_PRO'),
        'shipment_limit' => 500,
        'features'       => ['Up to 500 shipments', '10 drivers', 'Real-time tracking', 'GPS'],
    ],
    'agency' => [
        'name'           => 'Agency',
        'price'          => 39,
        'currency'       => 'EUR',
        'stripe_price'   => env('STRIPE_PRICE_AGENCY'),
        'shipment_limit' => null, // unlimited
        'features'       => ['Unlimited shipments', 'Unlimited drivers', 'Priority support', 'Analytics'],
    ],
];
