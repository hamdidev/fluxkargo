<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;



class CompanyController extends Controller
{

    public function suspend(Company $company): RedirectResponse
    {
        $company->update(['status' => 'suspended']);

        return back()->with('success', "Company {$company->name} suspended.");
    }

    public function activate(Company $company): RedirectResponse
    {
        $company->update(['status' => 'active']);

        return back()->with('success', "Company {$company->name} activated.");
    }

    public function destroy(Company $company): RedirectResponse
    {
        $company->users()->delete();
        $company->shipments()->delete();
        $company->delete();

        return redirect()->route('super.dashboard')
            ->with('success', "Company {$company->name} deleted.");
    }
}
