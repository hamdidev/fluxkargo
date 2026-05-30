<?php

namespace App\Http\Controllers\SuperAdmin; // change namespace per controller

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('SuperAdmin/Dashboard'); // change per controller
        // Company/Dashboard, Driver/Dashboard, Customer/Dashboard
    }
}
