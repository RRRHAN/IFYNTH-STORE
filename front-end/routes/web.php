<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('landing');
});

Route::get('/landing', function () {
    return view('landing');
})->name('landing');

Route::get('/login', function () {
    return view('login'); // Tampilkan halaman login
})->name('login');

Route::post('/login', function (Request $request) {
    // Contoh login sederhana: hanya cek username & password statis
    $email_or_phone = $request->input('email_or_phone');
    $password = $request->input('password');

    // Data login statis
    $username = 'admin';
    $correct_password = 'admin'; // Ubah nama variabel agar tidak ditimpa
    $email = 'admin@gmail.com';
    $phone = '081330234066';

    // Perbaikan kondisi
    if (($email_or_phone == $email || $email_or_phone == $phone) && $password == $correct_password) {
        // Simpan semua informasi user dalam session
        session([
            'user_logged_in' => true,
            'user_name' => $username,
            'user_email' => $email,
            'user_phone' => $phone
        ]);

        return redirect('landing')->with('message', 'You have successfully logged in');
    }

    return back()->with('message', 'Email / Phone Number or password is incorrect!');

})->name('login.process');

Route::get('/register', function () {
    return view('register');
})->name('register');

Route::get('/cart', function () {
    return view('cart');
})->name('cart');

Route::get('/IFYcatalog', function () {
    return view('IFYcatalog');
})->name('IFYcatalog');

Route::get('/NTHcatalog', function () {
    return view('NTHcatalog');
})->name('NTHcatalog');

Route::get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

Route::post('/logout', function () {
    session()->forget(['user_logged_in', 'user_name', 'user_email', 'user_phone']);
    return redirect('/landing')->with('message', 'Anda berhasil logout!');
})->name('logout');

