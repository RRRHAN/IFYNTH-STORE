<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return view('landing');
})->name('landing');

Route::get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

// Route user
Route::get('/register', [UserController::class, 'showRegisterForm'])->name('register');
Route::get('/login', [UserController::class, 'showLoginForm'])->name('login');
Route::post('/logout', [UserController::class, 'logout'])->name('logout');
