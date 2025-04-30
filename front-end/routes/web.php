<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CustomerProductController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MessageController;

Route::get('/', function () {
    return view('login');
})->name('login');

Route::get('/sellproduct', function () {
    return view('sellproduct');
})->name('sellproduct');

Route::get('/listmessages', function () {
    return view('listmessages');
})->name('listmessages');

// Route Home
Route::get('/landing', [HomeController::class, 'landing'])->name('landing');
Route::get('/dashboard', [HomeController::class, 'dashboard'])->name('dashboard');
// Route user
Route::get('/registerForm', [UserController::class, 'showRegisterForm'])->name('register');
Route::post('/register', [UserController::class, 'register'])->name('register.proccess');
Route::post('/changePassword', [UserController::class, 'changePassword'])->name('change.password');
Route::get('/loginForm', [UserController::class, 'showLoginForm'])->name('login');
Route::post('/login', [UserController::class, 'login'])->name('login.proccess');
Route::post('/logout', [UserController::class, 'logout'])->name('logout');

// Route product
Route::get('/catalog', [ProductController::class, 'fetchAll'])->name('products.getAll');
Route::get('/product/detail/{id}', [ProductController::class, 'detailProduct'])->name('product.detail');

// Route cart
Route::post('/addtoCart/{product_id}', [CartController::class,'AddtoCart'])->name('add.Cart');
Route::get('/getCart', [CartController::class,'getCart'])->name('get.Cart');
Route::post('/deleteItem/{id}/{quantity}', [CartController::class,'deleteItem'])->name('delete.Item');
Route::post('/updateCart/{product_id}/{cart_item_id}', [CartController::class,'updateCart'])->name('update.Cart');

Route::post('/offer-product', [CustomerProductController::class, 'AddOffer'])->name('offer.product');
Route::post('/deleteOffer/{id}', [CustomerProductController::class,'deleteOffer'])->name('delete.offer');


Route::get('/messages/list', [MessageController::class, 'fetchList'])->name('fetchList');
Route::post('/storeMessage', [MessageController::class, 'storeMessage'])->name('store.message');
Route::get('/getProductMessages/{productId}', [MessageController::class, 'getProductMessages']);


