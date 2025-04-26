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
    public function register(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|unique:users,username',
            'phoneNumber' => 'required|string',
            'password' => 'required|string',
            'password_confirmation' => 'required|string|same:password',
        ]);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode('admin:admin'),
                'Content-Type' => 'application/json'
            ])->post('http://localhost:7777/user/register', [
                        'name' => $validated['name'],
                        'username' => $validated['username'],
                        'phoneNumber' => $validated['phoneNumber'],
                        'password' => $validated['password'],
                    ]);

            if ($response->successful()) {
                // Flash success message
                session()->flash('success', 'User registered successfully!');
                return redirect()->route('loginForm');
            } else {
                // Handle errors from the external API
                $errors = $response->json()['errors'] ?? ['Failed to register'];
                session()->flash('error', $errors[0]); // Gunakan flash untuk error
                return redirect()->back();
            }
        } catch (\Exception $e) {
            Log::error('Registration failed: ' . $e->getMessage());
            session()->flash('error', 'An error occurred during registration');
            return redirect()->back();
        }
    }

    public function login(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);
    
        try {
            // Kirim request ke API eksternal
            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode('admin:admin'),
                'Content-Type' => 'application/json'
            ])->post('http://localhost:7777/user/login', [
                'username' => $validated['username'],
                'password' => $validated['password'],
                'role' => 'CUSTOMER',
            ]);
    
            // Jika respons berhasil
            if ($response->successful()) {
                $data = $response->json();
    
                if (isset($data['data']['token'])) {
                    // Simpan data token ke sesi
                    session([
                        'api_token' => $data['data']['token'],
                        'token_expiry' => $data['data']['expires'],
                        'user_logged_in' => true,
                        'username' => $validated['username']
                    ]);
    
                    // Flash success message dan redirect
                    session()->flash('success', 'Login successfully');
                    return redirect()->route('landing');
                }
    
                // Flash error jika token tidak ditemukan
                session()->flash('error', 'Token not received, login failed');
                return redirect()->back();
            }
    
            // Flash error dari API
            $error = $response->json()['errors'][0] ?? 'Login failed.';
            session()->flash('error', $error);
            return redirect()->back();
    
        } catch (\Exception $e) {
            Log::error('Login failed: ' . $e->getMessage());
            session()->flash('error', 'An error occurred during login');
            return redirect()->back();
        }
    }    

    public function logout(Request $request)
    {
        $token = session('api_token');
    
        // Hapus data sesi
        Session::forget('api_token');
        Session::forget('token_expiry');
        Session::forget('username');
        Session::forget('user_logged_in');
    
        try {
            // Kirim request logout ke API eksternal
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
            ])->post('http://localhost:7777/user/logout');
    
            if ($response->successful()) {
                // Flash pesan sukses dan redirect
                session()->flash('success', 'Logout successful!');
                return redirect()->route('landing');
            } else {
                // Flash error jika gagal
                session()->flash('error', 'Failed to logout.');
                return redirect()->back();
            }
        } catch (\Exception $e) {
            session()->flash('error', 'An error occurred during logout');
            return redirect()->back();
        }
    }
    
}