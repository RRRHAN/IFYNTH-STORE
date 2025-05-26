<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use GuzzleHttp\Client;

class CustomerProductController extends Controller
{

    public function AddOffer(Request $request)
    {
        $token = session('api_token');

        $validatedData = $request->validate([
            'name' => 'required',
            'price' => 'required|numeric',
            'description' => 'required',
            'files' => 'required|array',
            'files.*' => 'mimes:jpeg,png,jpg,gif,mp4,avi,mov,mkv,flv,webm',
        ]);



        $files = [];
        foreach ($validatedData['files'] as $file) {
            $files[] = [
                'name' => 'files',
                'contents' => \GuzzleHttp\Psr7\Utils::tryFopen($file->getRealPath(), 'r'),
                'filename' => $file->getClientOriginalName(),
            ];
        }

        try {
            $client = new Client();

            $response = $client->post($this->goApiUrl . '/cusproduct', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $token,
                ],
                'multipart' => array_merge([
                    [
                        'name' => 'name',
                        'contents' => $validatedData['name'],
                    ],
                    [
                        'name' => 'price',
                        'contents' => $validatedData['price'],
                    ],
                    [
                        'name' => 'description',
                        'contents' => $validatedData['description'],
                    ],
                ], $files)
            ]);

            $responseBody = json_decode($response->getBody(), true);
            \Log::info('Respon Data', [$responseBody['errors']]);

            if ($responseBody['errors'] === null) {
                session()->flash('success', 'Product added to offer');
                return redirect()->back();
            } else {
                $errors = $responseBody['errors'] ?? ['Failed to add product'];
                session()->flash('error', $errors[0]);
                return redirect()->back();
            }

        } catch (\Exception $e) {
            // Handle any exceptions
            session()->flash('error', 'An error occurred: ' . $e->getMessage());
            return redirect()->back();
        }
    }

    public function fetchOffers(Request $request)
    {
        $keyword = $request->query('keyword');
        $token = session('api_token');
        
        try {
            // Siapkan query parameters, hanya kirim yang tidak kosong
            $queryParams = array_filter([
                'keyword' => $keyword,
            ]);
        
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token
            ])->get($this->goApiUrl . '/cusproduct', $queryParams);
        
            if ($response->successful() && $response->json('errors') === null) {
                $allProducts = collect($response->json('data'));
        
                return collect([
                    'products' => $allProducts,
                ]);
            } else {
                return collect([
                    'error' => 'Failed to fetch products.'
                ]);
            }
        } catch (\Exception $e) {
            return collect([
                'error' => 'An error occurred while fetching products.'
            ]);
        }
    }

    public function deleteOffer($id)
    {
        $productId = $id;
        $token = session('api_token');

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token
            ])->delete($this->goApiUrl . '/cusproduct', ['product_id' => $productId]);

            if ($response->successful() && $response->json('errors') === null) {

                session()->flash('success', 'Item deleted');
                return redirect()->back();
            } else {
                $errors = $response->json()['errors'] ?? ['Failed to deleted item'];
                session()->flash('error', $errors[0]);
                return redirect()->back();
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}    