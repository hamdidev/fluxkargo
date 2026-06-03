<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request)
    {
        $user = auth()->user();

        $redirect = match ($user->role) {
            'super_admin' => route('super.dashboard'),
            'company_admin' => route('company.dashboard'),
            'driver' => route('driver.dashboard'),
            'customer' => route('customer.dashboard'),
            default => '/dashboard',
        };

        return $request->wantsJson()
            ? response()->json(['redirect' => $redirect])
            : redirect($redirect);
    }
}
