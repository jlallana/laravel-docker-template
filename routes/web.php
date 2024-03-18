<?php

use App\Http\Controllers\Api\HelloController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api/hello', [HelloController::class, 'index'])->name('hello');