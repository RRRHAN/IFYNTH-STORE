<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{

    public function showLoginForm()
    {
        return view('login');
    }
    public function showRegisterForm()
    {
        return view('register');
    }

    public function register(Request $request)
    {
        try {
            // Validate the incoming request
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|unique:users,username',
                'phoneNumber' => 'required|string',
                'password' => 'required|string',
                'password_confirmation' => 'required|string|same:password',
            ]);

            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode('admin:admin'),
                'Content-Type' => 'application/json'
            ])->post(config('app.back_end_base_url') . '/api/user/register', [
                        'name' => $validated['name'],
                        'username' => $validated['username'],
                        'phoneNumber' => $validated['phoneNumber'],
                        'password' => $validated['password'],
                    ]);

            if ($response->successful()) {
                session()->flash('success', 'User registered successfully!');
                return redirect()->route('login');
            } else {
                $errors = $response->json()['errors'] ?? ['Failed to register'];
                session()->flash('error', $errors[0]);
                return redirect()->back()->withInput();
            }

        } catch (ValidationException $e) {
            session()->flash('error', $e->validator->errors()->first());
            return redirect()->back()->withInput();
        } catch (\Exception $e) {
            Log::error('Registration failed: ' . $e->getMessage());
            session()->flash('error', 'An error occurred during registration');
            return redirect()->back()->withInput();
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
            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode('admin:admin'),
                'Content-Type' => 'application/json'
            ])->post(config('app.back_end_base_url') . '/api/user/login', [
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
                        'username' => $validated['username'],
                        'total_cart' => $data['data']['total_cart'],
                    ]);

                    $this->getPersonal();
                    return redirect()->route('landing');
                }

                session()->flash('error', 'Token not received, login failed');
                return redirect()->back();
            }

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
        session()->flush();

        try {
            // Kirim request logout ke API eksternal
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
            ])->post(config('app.back_end_base_url') . '/api/user/logout');

            if ($response->successful()) {
                // Flash pesan sukses dan redirect
                session()->flash('success', 'Logout successful!');
                return redirect()->route('login');
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

    public function changePassword(Request $request)
    {
        session()->flash('preloader', false);
        $token = session('api_token');

        try {
            // Validate the incoming request
            $validated = $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string',
                'password_confirmation' => 'required|string|same:new_password',
            ]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
            ])->patch(config('app.back_end_base_url') . '/api/user/password', [
                        'current_password' => $validated['current_password'],
                        'new_password' => $validated['new_password'],
                        'role' => "CUSTOMER",
                    ]);

            if (in_array('Unauthorized!', $response->json('errors') ?? [])) {
                return redirect()->route('login')->with('error', 'Session expired. Please log in again.');
            }

            if ($response->successful()) {
                session()->flash('success', 'Changed password successfully!');
                return redirect()->route('dashboard');
            } else {
                $errors = $response->json()['errors'] ?? ['Failed to change password'];
                session()->flash('error', $errors[0]);
                return redirect()->back();
            }

        } catch (ValidationException $e) {
            session()->flash('error', $e->validator->errors()->first());
            return redirect()->back()->withInput();
        } catch (\Exception $e) {
            Log::error('Password change failed: ' . $e->getMessage());
            session()->flash('error', 'An error occurred while changing the password');
            return redirect()->back();
        }
    }

    public function getPersonal()
    {
        $token = session('api_token');

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
            ])->get(config('app.back_end_base_url') . '/api/user/get-personal');

            if (in_array('Unauthorized!', $response->json('errors') ?? [])) {
                return redirect()->route('login')->with('error', 'Session expired. Please log in again.');
            }

            if ($response->successful()) {
                $data = collect($response->json());

                if ($data->has('data')) {
                    $user = $data->get('data');
                    session(['user' => $user]);
                    return collect($user);
                } else {
                    return collect([]);
                }
            } else {
                return collect([]);
            }
        } catch (\Exception $e) {
            // Jika ada exception
            return collect(['error' => 'Error occurred: ' . $e->getMessage()]);
        }
    }

    public function updateProfile(Request $request)
    {
        session()->flash('preloader', false);
        $token = session('api_token');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->patch(config('app.back_end_base_url') . '/api/user/updateCustomer', [
                    'username' => $request->username,
                    'email' => $request->email,
                    'name' => $request->name,
                    'phoneNumber' => $request->phone_number,
                    'destinationId' => $request->destination_id,
                    'address' => $request->address,
                    'zipCode' => $request->zip_code,
                    'destinationLabel' => $request->destination_label,
                ]);

        if ($response->successful()) {
            return redirect()->back()->with('success', 'Profile updated successfully.');
        }

        return redirect()->back()->with('error', 'Failed to update profile.');
    }

}