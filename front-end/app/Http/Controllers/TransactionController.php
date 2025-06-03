<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;
use GuzzleHttp\Client;

class TransactionController extends Controller
{
    public function addTransaction(Request $request)
    {
        $token = session("api_token");

        $validatedData = $request->validate([
            'addressId' => 'required',
            'courierIndex' => 'required',
        ]);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
            ])->post(config('app.back_end_base_url') . '/api/transaction', [
                        'CustomerAddressID' => $validatedData['addressId'],
                        'CourierIndex' => (int) $validatedData['courierIndex'],
                    ]);

            $responseBody = $response->json();

            if (in_array('Unauthorized!', $responseBody['errors'] ?? [])) {
                return redirect()->route('login')->with('error', 'Session expired. Please log in again.');
            }

            if ($response->status() === 201) {
                Session::forget('total_cart');
                return redirect()->back()->with('success', 'Transaction added successfully!');
            } else {
                return redirect()->back()->with('error', 'Failed to add transaction');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function payTransaction(Request $request)
    {
        $token = session("api_token");

        $validatedData = $request->validate([
            'payment_proof' => 'required|file|mimes:jpg,jpeg,png,webp',
            'transaction_id' => 'required'
        ]);

        try {
            $client = new Client();
            $response = $client->request('POST', config('app.back_end_base_url') . '/api/transaction/pay', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $token,
                    'Accept' => 'application/json',
                ],
                'multipart' => [
                    [
                        'name' => 'payment_proof',
                        'contents' => fopen($request->file('payment_proof')->getRealPath(), 'r'),
                        'filename' => $request->file('payment_proof')->getClientOriginalName(),
                    ],
                    [
                        'name' => 'transactionId',
                        'contents' => $validatedData['transaction_id'],
                    ],
                ],
            ]);

            $responseBody = json_decode($response->getBody(), true);
            \Log::info('Respon Data', ['errors' => $responseBody['errors'] ?? null]);

            if (in_array('Unauthorized!', $responseBody['errors'] ?? [])) {
                return redirect()->route('login')->with('error', 'Session expired. Please log in again.');
            }

            if ($response->getStatusCode() === 200 && (empty($responseBody['errors']))) {
                session()->flash('success', 'Payment successfully!');
                return redirect()->back();
            } else {
                $errors = $responseBody['errors'] ?? ['Failed to pay transaction'];
                session()->flash('error', $errors[0]);
                return redirect()->back();
            }
        } catch (\Exception $e) {
            session()->flash('error', 'An error occurred: ' . $e->getMessage());
            return redirect()->back();
        }
    }


    public function getTransaction()
    {

        $token = Session::get('api_token');

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
            ])->get(config('app.back_end_base_url') . '/api/transaction');

            if (in_array('Unauthorized!', $response->json('errors') ?? [])) {
                return redirect()->route('login')->with('error', 'Session expired. Please log in again.');
            }

            if ($response->successful() && $response->json('errors') === null) {
                $transactions = collect($response->json('data'));

                return collect([
                    'transactions' => $transactions,
                ]);

            } else {
                return collect(['error' => 'Failed to fetch transactions.']);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error while fetching transactions', 'details' => $e->getMessage()], 500);
        }
    }
}

