<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $company = Company::create([
            'name'   => 'Demo Logistics',
            'slug'   => 'demo-logistics',
            'email'  => 'info@demo.com',
            'status' => 'active',
        ]);

        User::create([
            'name'     => 'Super Admin',
            'email'    => 'super@fluxcargo.com',
            'password' => 'password',
            'role'     => 'super_admin',
            'status'   => 'active',
        ]);

        User::create([
            'company_id' => $company->id,
            'name'       => 'Company Admin',
            'email'      => 'admin@demo.com',
            'password'   => 'password',
            'role'       => 'company_admin',
            'status'     => 'active',
        ]);

        User::create([
            'company_id' => $company->id,
            'name'       => 'John Driver',
            'email'      => 'driver@demo.com',
            'password'   => 'password',
            'role'       => 'driver',
            'status'     => 'active',
        ]);

        User::create([
            'company_id' => $company->id,
            'name'       => 'Jane Customer',
            'email'      => 'customer@demo.com',
            'password'   => 'password',
            'role'       => 'customer',
            'status'     => 'active',
        ]);
        User::create([
            'company_id' => $company->id,
            'name'       => 'Jane Dispatcher',
            'email'      => 'dispatcher@demo.com',
            'password'   => 'password',
            'role'       => 'dispatcher',
            'status'     => 'active',
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
