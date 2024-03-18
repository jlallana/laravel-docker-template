<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

class HelloController extends ApiController
{
    public function index(Request $request): string
    {
        // @phpstan-ignore-next-line
        $jwt = strval($request->header("Authorization"));
        return 'Hello, World!'. $jwt;
    }
}