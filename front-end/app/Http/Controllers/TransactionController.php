<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Collection;
class TransactionController extends Controller
{
    public function addTransaction(Request $request)
    {
        $token = session("api_token");

        $validatedData = $request->validate([
            'name' => 'required',
            'phone_number' => 'required',
            'address' => 'required',
            'destination_label' => 'required',
            'zip_code' => 'required',
            'courir' => 'required',
            'shipping_cost' => 'required|numeric',
            'payment_proof' => 'required|file|mimes:jpeg,png,jpg',
        ]);

        try {
            // Siapkan file sebagai resource stream
            $file = $request->file('payment_proof');

            $multipartData = [
                [
                    'name' => 'name',
                    'contents' => $validatedData['name'],
                ],
                [
                    'name' => 'phone_number',
                    'contents' => $validatedData['phone_number'],
                ],
                [
                    'name' => 'address',
                    'contents' => $validatedData['address'],
                ],
                [
                    'name' => 'destination_label',
                    'contents' => $validatedData['destination_label'],
                ],
                [
                    'name' => 'zip_code',
                    'contents' => $validatedData['zip_code'],
                ],
                [
                    'name' => 'courir',
                    'contents' => $validatedData['courir'],
                ],
                [
                    'name' => 'shipping_cost',
                    'contents' => $validatedData['shipping_cost'] = intval($validatedData['shipping_cost']),
                ],
                [
                    'name' => 'payment_method',
                    'contents' => "Bank Transfer",
                ],
                [
                    'name' => 'payment_proof',
                    'contents' => fopen($file->getPathname(), 'r'),
                    'filename' => $file->getClientOriginalName(),
                ],
            ];



            $client = new \GuzzleHttp\Client();

            $response = $client->request('POST', config('app.back_end_base_url').'/api/transaction', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $token,
                ],
                'multipart' => $multipartData,
            ]);

            if ($response->getStatusCode() === 201) {
                Session::forget('total_cart');
                return redirect()->back()->with('success', 'Transaction added successfully!');
            } else {
                return redirect()->back()->with('error', 'Failed to add transaction');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function getTransaction()
    {

        $token = Session::get('api_token');
    
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
            ])->get(config('app.back_end_base_url').'/api/transaction');
    
            if ($response->successful()) {
                $transactions = collect($response->json('data'));
    
                if ($transactions->isEmpty()) {
                    return response()->json(['message' => 'No transactions found'], 404);
                }
    
                return response()->json(['transactions' => $transactions], 200);
            } else {
                return response()->json(['error' => 'Failed to fetch transactions', 'details' => $response->body()], $response->status());
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error while fetching transactions', 'details' => $e->getMessage()], 500);
        }
    }
}

