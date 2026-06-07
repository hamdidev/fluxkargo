<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\TeamMemberCreated;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function index(): Response
    {
        $companyId = auth()->user()->company_id;

        $members = User::where('company_id', $companyId)
            ->whereIn('role', ['driver', 'customer'])
            ->latest()
            ->get();

        return Inertia::render('Company/Team', [
            'members' => $members,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role'  => 'required|in:driver,customer,dispatcher',
            'phone' => 'nullable|string|max:20',
        ]);

        $password = Str::random(12);

        $user = User::create([
            'company_id' => auth()->user()->company_id,
            'name'       => $validated['name'],
            'email'      => $validated['email'],
            'phone'      => $validated['phone'] ?? null,
            'password'   => Hash::make($password),
            'role'       => $validated['role'],
            'status'     => 'active',
        ]);

        $user->notify(new TeamMemberCreated($password, auth()->user()->company->name));

        return back()->with('success', "Account created for {$user->name}. Login credentials sent to {$user->email}.");
    }

    public function suspend(User $user): RedirectResponse
    {
        $this->ensureSameCompany($user);
        $user->update(['status' => 'suspended']);
        return back()->with('success', "{$user->name} suspended.");
    }

    public function activate(User $user): RedirectResponse
    {
        $this->ensureSameCompany($user);
        $user->update(['status' => 'active']);
        return back()->with('success', "{$user->name} activated.");
    }

    public function resetPassword(User $user): RedirectResponse
    {
        $this->ensureSameCompany($user);

        $password = Str::random(12);
        $user->update(['password' => Hash::make($password)]);

        return back()->with('success', "Password reset. New password: {$password}");
    }

    public function destroy(User $user): RedirectResponse
    {
        $this->ensureSameCompany($user);
        $user->delete();
        return back()->with('success', "{$user->name} removed.");
    }

    private function ensureSameCompany(User $user): void
    {
        if ($user->company_id !== auth()->user()->company_id) {
            abort(403);
        }
    }
}
