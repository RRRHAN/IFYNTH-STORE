<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class UserController extends Controller
{

    // Menampilkan form login
    public function showLoginForm()
    {
        return view('login'); // Menampilkan halaman login.blade.php
    }
    // Menampilkan form login
    public function showRegisterForm()
    {
        return view('register'); // Menampilkan halaman login.blade.php
    }

}