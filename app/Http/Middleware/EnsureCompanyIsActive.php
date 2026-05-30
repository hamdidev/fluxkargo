<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCompanyIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if ($user && $user->company_id) {
            $company = $user->company;

            if (!$company || $company->status === 'suspended') {
                auth()->logout();
                return redirect()->route('login')
                    ->withErrors(['email' => 'Your company account has been suspended.']);
            }
        }

        return $next($request);
    }
}
