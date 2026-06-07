<?php

use App\Http\Controllers\Company\BillingController;
use App\Http\Controllers\Company\DashboardController as CompanyDashboard;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboard;
use App\Http\Controllers\Driver\DashboardController as DriverDashboard;
use App\Http\Controllers\Driver\LocationController as DriverLocationController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\SuperAdmin\DashboardController as SuperDashboard;
use App\Http\Controllers\SuperAdmin\CompanyController as SuperCompanyController;
use App\Http\Controllers\Company\TeamController;
use App\Http\Controllers\TrackingController;
use App\Http\Controllers\SuperAdmin\UserController as SuperUserController;
use App\Http\Controllers\Dispatcher\DashboardController as DispatcherDashboard;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware('auth')->get('/dashboard', function () {
    return redirect()->route(match (auth()->user()->role) {
        'super_admin'   => 'super.dashboard',
        'company_admin' => 'company.dashboard',
        'driver'        => 'driver.dashboard',
        'customer'      => 'customer.dashboard',
        'dispatcher'    => 'dispatcher.dashboard',
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
    Route::get('/companies', [SuperDashboard::class, 'index'])->name('companies');
    Route::get('/users',            [SuperUserController::class, 'index'])->name('users');
    Route::post('/companies/{company}/suspend',  [SuperCompanyController::class, 'suspend'])->name('companies.suspend');
    Route::post('/companies/{company}/activate', [SuperCompanyController::class, 'activate'])->name('companies.activate');
    Route::delete('/companies/{company}',        [SuperCompanyController::class, 'destroy'])->name('companies.destroy');
});

// Company Admin
Route::middleware(['auth', 'role:company_admin,super_admin'])->prefix('company')->name('company.')->group(function () {
    Route::get('/dashboard', [CompanyDashboard::class, 'index'])->name('dashboard');
    Route::get('/billing',   [BillingController::class, 'index'])->name('billing');
    Route::post('/billing/checkout', [BillingController::class, 'checkout'])->name('billing.checkout');
    Route::get('/billing/success', [BillingController::class, 'success'])->name('billing.success');
    Route::post('/billing/portal',   [BillingController::class, 'portal'])->name('billing.portal');
    Route::post('/billing/cancel',   [BillingController::class, 'cancel'])->name('billing.cancel');
    Route::post('/billing/resume',   [BillingController::class, 'resume'])->name('billing.resume');

    // Team management
    Route::get('/team',                        [TeamController::class, 'index'])->name('team');
    Route::post('/team',                       [TeamController::class, 'store'])->name('team.store');
    Route::post('/team/{user}/suspend',        [TeamController::class, 'suspend'])->name('team.suspend');
    Route::post('/team/{user}/activate',       [TeamController::class, 'activate'])->name('team.activate');
    Route::post('/team/{user}/reset-password', [TeamController::class, 'resetPassword'])->name('team.reset-password');
    Route::delete('/team/{user}',              [TeamController::class, 'destroy'])->name('team.destroy');
});

// Driver
Route::middleware(['auth', 'role:driver'])->prefix('driver')->name('driver.')->group(function () {
    Route::get('/dashboard', [DriverDashboard::class, 'index'])->name('dashboard');
    Route::post('/location', [DriverLocationController::class, 'update'])->name('location.update');
});

// Customer
Route::middleware(['auth', 'role:customer'])->prefix('customer')->name('customer.')->group(function () {
    Route::get('/dashboard', [CustomerDashboard::class, 'index'])->name('dashboard');
});
// Dispatcher
Route::middleware(['auth', 'role:dispatcher'])->prefix('dispatcher')->name('dispatcher.')->group(function () {
    Route::get('/dashboard', [DispatcherDashboard::class, 'index'])->name('dashboard');
});

// Shipments — all roles, policy handles authorization
Route::middleware(['auth', 'role:super_admin,company_admin,driver,customer,dispatcher'])->group(function () {
    Route::resource('shipments', ShipmentController::class)
        ->except(['create', 'edit']);
    Route::post('shipments/{shipment}/transition', [ShipmentController::class, 'transition'])
        ->name('shipments.transition');
});
Route::middleware('auth')->group(function () {
    Route::post('/notifications/read-all', function () {
        auth()->user()->unreadNotifications->markAsRead();
        return back();
    })->name('notifications.read-all');
});

Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook'])
    ->name('cashier.webhook');

Route::get('/track/{tracking_number}', [TrackingController::class, 'show'])
    ->name('track');

require __DIR__ . '/settings.php';
