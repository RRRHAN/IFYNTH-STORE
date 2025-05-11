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
Route::controller(HomeController::class)->group(function () {
    Route::get('/landing', 'landing')->name('landing');
    Route::get('/dashboard', 'dashboard')->name('dashboard');
});

// Route user
Route::controller(UserController::class)->group(function () {
    Route::get('/registerForm', 'showRegisterForm')->name('register');
    Route::post('/register', 'register')->name('register.proccess');
    Route::post('/changePassword', 'changePassword')->name('change.password');
    Route::get('/loginForm', 'showLoginForm')->name('login');
    Route::post('/login', 'login')->name('login.proccess');
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
});

// Route ongkir
Route::controller(OngkirController::class)->group(function () {
    Route::get('/search-destination', 'searchDestination');
    Route::post('/check-tariff', 'getShippingCost');
});


Route::controller(TransactionController::class)->group(function () {
    Route::post('/checkout', 'addTransaction');
});

Route::get('/tryon-form', function () {
    $clothes = Http::get('http://localhost:8001/clothes')->json();
    return view('virtual_tryon', ['clothes' => $clothes['clothes']]);
});

Route::post('/try-on', function (\Illuminate\Http\Request $request) {
    // Upload foto ke backend Python
    $response = Http::attach('file', file_get_contents($request->file('photo')), $request->file('photo')->getClientOriginalName())
        ->post('http://localhost:8001/upload-photo');

    $photoName = $response->json()['filename'];

    // Kirim request try-on
    $result = Http::asForm()->post('http://localhost:8001/try-on', [
        'photo_name' => $photoName,
        'clothes_name' => $request->input('clothes'),
    ]);

    return view('tryon_result', [
        'result_url' => 'http://localhost:8001/results/' . basename($result->json()['result_url']),
    ]);
});