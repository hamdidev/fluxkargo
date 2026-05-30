<?php

namespace App\Actions\Fortify;

use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    public function create(array $input): User
    {
        Validator::make($input, [
            'name'         => ['required', 'string', 'max:255'],
            'email'        => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'     => ['required', 'string', 'min:8', 'confirmed'],
            'company_name' => ['required', 'string', 'max:255'],
        ])->validate();

        $company = Company::create([
            'name'   => $input['company_name'],
            'slug'   => Str::slug($input['company_name']) . '-' . Str::random(4),
            'email'  => $input['email'],
            'status' => 'trial',
        ]);

        return User::create([
            'company_id' => $company->id,
            'name'       => $input['name'],
            'email'      => $input['email'],
            'password'   => Hash::make($input['password']),
            'role'       => 'company_admin',
            'status'     => 'active',
        ]);
    }
}
