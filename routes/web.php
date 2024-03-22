<?php

use App\Http\Controllers\Demo;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => view('home'));
Route::get('/demo', [Demo::class, 'index'])->name('demo');