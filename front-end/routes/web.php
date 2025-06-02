<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CustomerProductController;
use App\Http\Controllers\OngkirController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\TryonController;
use App\Http\Controllers\AddressController;
use Illuminate\Support\Facades\Http;

Route::get('/', function () {
    $token = session('api_token');
    if($token == null){
        return view('login');
    }
    $response = Http::withHeaders([
        'Authorization' => 'Bearer ' . $token,
        'Content-Type' => 'application/json'
    ])->get(config('app.back_end_base_url') . '/api/user/check-jwt');
    if ($response->successful()) {
        return redirect()->route('landing');

    }
    session()->flush();
    session()->flash('error', 'Session expired. Please log in again.');
    return redirect()->route('login');
})->name('login');

Route::get('/sellproduct', function () {
    return view('sellproduct');
})->name('sellproduct');

Route::get('/listmessages', function () {
    return view('listmessages');
})->name('listmessages');

// Route Home
Route::controller(HomeController::class)->group(function () {
    Route::get('/landing', 'landing')->name('landing');
    Route::get('/dashboard', 'dashboard')->name('dashboard');
    Route::get('/countUnread', 'countUnread')->name('countUnread');
});

// Route user
Route::controller(UserController::class)->group(function () {
    Route::get('/registerForm', 'showRegisterForm')->name('register');
    Route::post('/register', 'register')->name('register.proccess');
    Route::post('/changePassword', 'changePassword')->name('change.password');
    Route::get('/loginForm', 'showLoginForm')->name('login');
    Route::post('/login', 'login')->name('login.proccess');
    Route::post('/update-profile', 'updateProfile')->name('update.profile');
    Route::post('/logout', 'logout')->name('logout');
});

// Route product
Route::controller(ProductController::class)->group(function () {
    Route::get('/catalog', 'fetchAll')->name('products.getAll');
    Route::get('/product/detail/{id}', 'detailProduct')->name('product.detail');
});

// Route cart
Route::controller(CartController::class)->group(function () {
    Route::post('/addtoCart/{product_id}', 'AddtoCart')->name('add.Cart');
    Route::get('/getCart', 'getCart')->name('get.Cart');
    Route::post('/deleteItem/{id}/{quantity}', 'deleteItem')->name('delete.Item');
    Route::post('/updateCart/{product_id}/{cart_item_id}', 'updateCart')->name('update.Cart');
});

// Route Offer
Route::controller(CustomerProductController::class)->group(function () {
    Route::post('/offer-product', 'AddOffer')->name('offer.product');
    Route::post('/deleteOffer/{id}', 'deleteOffer')->name('delete.offer');
});

// Route message
Route::controller(MessageController::class)->group(function () {
    Route::get('/messages/list', 'fetchList')->name('fetchList');
    Route::post('/storeMessage', 'storeMessage')->name('store.message');
    Route::get('/getProductMessages/{productId}', 'getProductMessages');
    Route::get('/message/list/json',  'fetchListJson')->name('fetchListJson');

});

// Route ongkir
Route::controller(OngkirController::class)->group(function () {
    Route::get('/search-destination', 'searchDestination');
    Route::post('/check-tariff', 'getShippingCost');
});

// Route address
Route::controller(AddressController::class)->group(function () {
    Route::post('/addAddress', 'addAddress') -> name('addAddress');
    Route::get('/deleteAddress/{id}', 'deleteAddress')->name('deleteAddress');
    Route::put('/updateAddress/{id}', 'updateAddress')->name('updateAddress');
});


Route::controller(TransactionController::class)->group(function () {
    Route::post('/checkout', 'addTransaction');
});

Route::post('/tryon', [TryonController::class, 'tryon']);

Route::get('/tryon-form', function () {
    return view('tryon');
})->name('tryon-form');