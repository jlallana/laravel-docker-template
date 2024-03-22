<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class Demo extends Controller
{
    public function index(): JsonResponse
    {
        // @phpstan-ignore-next-line
        return response()->json(request()->header('Authorization'));
    }
}