<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::with('company:id,name')
            ->latest()
            ->paginate(20);

        return Inertia::render('SuperAdmin/Users', [
            'users' => $users,
        ]);
    }
}
