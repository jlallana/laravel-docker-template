<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;
use \Illuminate\Contracts\View\Factory;


class AuthController extends Controller
{
    public function auth(): Factory|View
    {
        return view('auth', [
            'auth_provider' => 'http://localhost:8080/realms/localhost',
            'client_id' => 'localhost'
        ]);
    }
}