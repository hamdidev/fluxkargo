<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Shipment;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_companies'  => Company::count(),
            'active_companies' => Company::where('status', 'active')->count(),
            'trial_companies'  => Company::where('status', 'trial')->count(),
            'total_shipments'  => Shipment::count(),
            'total_users'      => User::count(),
            'total_revenue'    => Shipment::sum('price'),
        ];

        $companies = Company::withCount(['users', 'shipments'])
            ->latest()
            ->paginate(15);

        return Inertia::render('SuperAdmin/Dashboard', compact('stats', 'companies'));
    }
}
