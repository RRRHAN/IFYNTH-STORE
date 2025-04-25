<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;

Route::get('/', function () {
    return view('landing');
})->name('landing');
Route::get('/landing', function () {
    return view('landing');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

// routes/web.php
Route::get('/catalog/{department}', function ($department) {
    return view('catalog', ['department' => $department]);
});
Route::get('/product/detail/{id}', function ($id) {
    return view('detail_product');
})->name('product.detail');

// Route user
Route::get('/registerForm', [UserController::class, 'showRegisterForm'])->name('register');
Route::post('/register', [UserController::class, 'register'])->name('register.proccess');
Route::get('/loginForm', [UserController::class, 'showLoginForm'])->name('login');
Route::post('/login', [UserController::class, 'login'])->name('login.proccess');
Route::post('/logout', [UserController::class, 'logout'])->name('logout');

// Route product
Route::get('/catalog', [ProductController::class, 'fetchByDepartment'])->name('products.byDepartment');
Route::get('/product/detail/{id}', [ProductController::class, 'detailProduct'])->name('product.detail');


