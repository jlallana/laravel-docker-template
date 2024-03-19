<?php

use App\Http\Controllers\Api\HelloController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api/hello', [HelloController::class, 'index'])->name('hello');
Route::get('/auth', [AuthController::class, 'auth'])->name('auth');