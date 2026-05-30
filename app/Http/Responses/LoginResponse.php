<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = auth()->user();

        $redirect = match ($user->role) {
            'super_admin'   => route('super.dashboard'),
            'company_admin' => route('company.dashboard'),
            'driver'        => route('driver.dashboard'),
            'customer'      => route('customer.dashboard'),
            default         => '/dashboard',
        };

        return $request->wantsJson()
            ? response()->json(['two_factor' => false])
            : redirect($redirect);
    }
}
