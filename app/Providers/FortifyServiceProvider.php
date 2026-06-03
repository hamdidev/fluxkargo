<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Http\Responses\LoginResponse;
use App\Http\Responses\RegisterResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Contracts\ConfirmPasswordViewResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Laravel\Fortify\Contracts\RequestPasswordResetLinkViewResponse;
use Laravel\Fortify\Contracts\ResetPasswordViewResponse;
use Laravel\Fortify\Contracts\TwoFactorChallengeViewResponse;
use Laravel\Fortify\Contracts\VerifyEmailViewResponse;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(LoginResponseContract::class, LoginResponse::class);
        $this->app->singleton(RegisterResponseContract::class, RegisterResponse::class);

        $this->app->bind(
            TwoFactorChallengeViewResponse::class,
            fn () => new class implements TwoFactorChallengeViewResponse
            {
                public function toResponse($request)
                {
                    return inertia('auth/two-factor-challenge')->toResponse($request);
                }
            }
        );

        $this->app->bind(
            VerifyEmailViewResponse::class,
            fn () => new class implements VerifyEmailViewResponse
            {
                public function toResponse($request)
                {
                    return inertia('auth/verify-email')->toResponse($request);
                }
            }
        );

        $this->app->bind(
            ConfirmPasswordViewResponse::class,
            fn () => new class implements ConfirmPasswordViewResponse
            {
                public function toResponse($request)
                {
                    return inertia('auth/confirm-password')->toResponse($request);
                }
            }
        );

        $this->app->bind(
            RequestPasswordResetLinkViewResponse::class,
            fn () => new class implements RequestPasswordResetLinkViewResponse
            {
                public function toResponse($request)
                {
                    return inertia('auth/forgot-password', [
                        'status' => session('status'),
                    ])->toResponse($request);
                }
            }
        );

        $this->app->bind(
            ResetPasswordViewResponse::class,
            fn () => new class implements ResetPasswordViewResponse
            {
                public function toResponse($request)
                {
                    return inertia('auth/reset-password', [
                        'email' => $request->email,
                        'token' => $request->route('token'),
                    ])->toResponse($request);
                }
            }
        );
    }

    public function boot(): void
    {
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);

        Fortify::authenticateUsing(function (Request $request) {
            $user = User::where('email', $request->email)->first();

            if ($user && Hash::check($request->password, $user->password)) {
                if ($user->status === 'suspended') {
                    return null;
                }

                return $user;
            }

            return null;
        });

        Fortify::redirects('logout', '/login');
    }
}
