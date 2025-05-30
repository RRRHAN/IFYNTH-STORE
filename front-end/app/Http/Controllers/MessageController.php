<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{

    public function fetchList(Request $request)
    {
        $keyword = $request->query('keyword');
        $token = session('api_token');

        try {
            // Kirim hanya query yang tidak kosong
            $queryParams = array_filter([
                'keyword' => $keyword,
            ]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token
            ])->get( config('app.back_end_base_url') . '/api/cusproduct/list', $queryParams);

            if (in_array('Unauthorized!', $response->json('errors') ?? [])) {
                return redirect()->route('login')->with('error', 'Session expired. Please log in again.');
            }

            if ($response->successful() && $response->json('errors') === null) {
                $list = collect($response->json('data'));

                return view('listmessages', [
                    'list' => $list
                ]);
            } else {
                return view('listmessages', [
                    'error' => 'Failed to fetch list.'
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error fetching list: ' . $e->getMessage());
            return view('listmessages', [
                'error' => 'An error occurred while fetching list.'
            ]);
        }
    }

    public function getProductMessages($productId)
    {
        $token = session('api_token');
        try {
            // Ambil pesan untuk produk dari API atau database
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token
            ])->get( config('app.back_end_base_url') . '/api/message/' . $productId);

            if (in_array('Unauthorized!', $response->json('errors') ?? [])) {
                return redirect()->route('login')->with('error', 'Session expired. Please log in again.');
            }

            if ($response->successful()) {
                $messages = collect($response->json());
                Log::info('API Response:', $response->json());
                Log::info('Fetched messages:', $messages->toArray());
                return response()->json([
                    'messages' => $messages
                ]);
            } else {
                return response()->json([
                    'messages' => []
                ]);
            }
        } catch (\Exception $e) {
            // Tangani error jika terjadi masalah
            return response()->json([
                'messages' => []
            ]);
        }
    }

    // POST /api/message
    public function storeMessage(Request $request)
    {
        $token = session('api_token');

        // Validasi request
        $validated = $request->validate([
            'product_id' => 'required',
            'message' => 'required|string',
        ]);

        try {
            // Kirim data sebagai JSON langsung
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token
            ])->post(config('app.back_end_base_url') . '/api/message/', [
                        'product_id' => $validated['product_id'],
                        'message' => $validated['message'],
                    ]);

            if (in_array('Unauthorized!', $response->json('errors') ?? [])) {
                return redirect()->route('login')->with('error', 'Session expired. Please log in again.');
            }

            $result = $response->json();

            return response()->json($result, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to send message',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
public function fetchListJson(Request $request)
{
    $token = session('api_token');
    if (!$token) {
        return response()->json(['error' => 'Session token missing.'], 401);
    }

    try {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->get(config('app.back_end_base_url') . '/api/cusproduct/list');

        if ($response->successful() && $response->json('errors') === null) {
            $list = collect($response->json('data'));

            $unreadCounts = $list->mapWithKeys(function ($product) {
                return [
                    $product['ProductID'] => $product['UnreadCount'] ?? 0
                ];
            });

            return response()->json($unreadCounts);
        } else {
            return response()->json(['error' => 'Failed to fetch list.'], 500);
        }
    } catch (\Exception $e) {
        \Log::error('Fetch unread counts error: ' . $e->getMessage());
        return response()->json(['error' => 'An error occurred.'], 500);
    }
}

}