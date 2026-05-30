<?php

use App\Http\Controllers\Company\DashboardController as CompanyDashboard;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboard;
use App\Http\Controllers\Driver\DashboardController as DriverDashboard;
use App\Http\Controllers\Driver\LocationController as DriverLocationController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\SuperAdmin\DashboardController as SuperDashboard;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware('auth')->get('/dashboard', function () {
    return redirect()->route(match (auth()->user()->role) {
        'super_admin'   => 'super.dashboard',
        'company_admin' => 'company.dashboard',
        'driver'        => 'driver.dashboard',
        'customer'      => 'customer.dashboard',
    });
})->name('dashboard');

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/login', fn() => inertia('auth/login'))->name('login');
    Route::get('/register', fn() => inertia('auth/register'))->name('register');
});

// Super Admin
Route::middleware(['auth', 'role:super_admin'])->prefix('super')->name('super.')->group(function () {
    Route::get('/dashboard', [SuperDashboard::class, 'index'])->name('dashboard');
});

// Company Admin
Route::middleware(['auth', 'role:company_admin,super_admin'])->prefix('company')->name('company.')->group(function () {
    Route::get('/dashboard', [CompanyDashboard::class, 'index'])->name('dashboard');
});

// Driver
Route::middleware(['auth', 'role:driver'])->prefix('driver')->name('driver.')->group(function () {
    Route::get('/dashboard', [DriverDashboard::class, 'index'])->name('dashboard');
    Route::post('/location', [DriverLocationController::class, 'update'])->name('location.update');
});;

// Customer
Route::middleware(['auth', 'role:customer'])->prefix('customer')->name('customer.')->group(function () {
    Route::get('/dashboard', [CustomerDashboard::class, 'index'])->name('dashboard');
});

// Shipments — all roles, policy handles authorization
Route::middleware(['auth', 'role:super_admin,company_admin,driver,customer'])->group(function () {
    Route::resource('shipments', ShipmentController::class)
        ->except(['create', 'edit']);
    Route::post('shipments/{shipment}/transition', [ShipmentController::class, 'transition'])
        ->name('shipments.transition');
});

require __DIR__ . '/settings.php';
