<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class UserController extends Controller
{
    public function register(Request $request)
    {
        // Ambil semua input
        $data = $request->all();
    
        // Validasi manual password dan konfirmasi
        if ($request->input('password') !== $request->input('password_confirmation')) {
            return redirect()->route('register')->with('error', 'Password and confirmation do not match.');
        }
    
        // Validasi lain (misalnya nama, username, dll)
        if (!$request->filled('name') || !$request->filled('username') || !$request->filled('phoneNumber') || !$request->filled('password')) {
            return redirect()->route('register')->with('error', 'Please fill in all required fields.');
        }
    
        // Kirimkan data ke backend Go
        $response = Http::withHeaders([
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post('http://localhost:7777/user/register', $data);
    
        if ($response->successful()) {
            $responseData = $response->json();
    
            if (isset($responseData['errors']) && $responseData['errors'] === null) {
                return redirect()->route('login')->with('success', 'User registered successfully!');
            } else {
                return redirect()->route('register')->with('error', $responseData['message'] ?? 'Failed to register user in Go backend');
            }
        } else {
            return redirect()->route('register')->with('error', 'Failed to register user in Go backend');
        }
    }
}
