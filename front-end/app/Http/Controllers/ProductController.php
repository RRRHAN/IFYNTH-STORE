<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductController extends Controller
{
    public function fetchByDepartment(Request $request)
    {
        $department = $request->query('department');
        $page = $request->query('page', 1);
        $perPage = 8;

        $token = session('api_token');

        if (!$token) {
            return redirect()->route('login')->with('error', 'Authentication required. Please log in.');
        }

        try {
            // Attempt to fetch paginated data directly from the API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
            ])->get(config('app.back_end_base_url') . '/api/product', [
                        'department' => $department,
                        'page' => $page,    // Pass current page to the API
                        'limit' => $perPage, // Pass per page limit to the API
                    ]);

            // Handle Unauthorized response
            if ($response->status() === 401 || in_array('Unauthorized!', $response->json('errors') ?? [])) {
                session()->forget('api_token'); // Clear expired token
                return redirect()->route('login')->with('error', 'Session expired. Please log in again.');
            }

            if ($response->successful() && $response->json('errors') === null) {
                $apiData = $response->json();

                // Check if API response contains direct pagination data
                if (
                    isset($apiData['data']) && is_array($apiData['data']) &&
                    isset($apiData['total']) && isset($apiData['per_page']) && isset($apiData['current_page'])
                ) {

                    // *** Scenario 1: API handles pagination directly ***
                    $products = collect($apiData['data']);
                    $totalProducts = $apiData['total'];
                    $perPageFromApi = $apiData['per_page'];
                    $currentPageFromApi = $apiData['current_page'];
                    $totalPagesFromApi = ceil($totalProducts / $perPageFromApi); // Use API's per_page for total_pages

                    $pagination = [
                        'total_pages' => $totalPagesFromApi,
                        'current_page' => (int) $currentPageFromApi,
                        'perPage' => (int) $perPageFromApi,
                        'total' => $totalProducts,
                    ];

                } else {
                    // *** Scenario 2: API returns ALL data for the department, requiring manual pagination ***
                    // This is the fallback if your API doesn't support pagination parameters
                    $allProducts = collect($apiData['data'] ?? []); // Ensure it's a collection

                    $totalProducts = $allProducts->count();
                    // Manually slice the collection based on the page and perPage
                    $products = $allProducts->slice(($page - 1) * $perPage, $perPage)->values();

                    $totalPages = ceil($totalProducts / $perPage);

                    $pagination = [
                        'total_pages' => $totalPages,
                        'current_page' => (int) $page,
                        'perPage' => $perPage,
                        'total' => $totalProducts,
                    ];
                }

                return view('catalog', compact('products', 'pagination'));

            } else {
                // Handle API error messages
                $errorMessage = $response->json('message') ?? $response->json('errors')[0] ?? 'Failed to fetch products from API.';
                return redirect()->back()->with('error', $errorMessage);
            }
        } catch (\Exception $e) {
            // Catch network errors or other unexpected exceptions
            \Log::error('Error fetching products by department: ' . $e->getMessage(), ['exception' => $e]);
            return redirect()->back()->with('error', 'An unexpected error occurred while fetching products.');
        }
    }

    public function fetchAll(Request $request)
    {
        $keyword = $request->query('keyword');
        $department = $request->query('department');
        $category = $request->query('category');
        $page = $request->query('page', 1);
        $perPage = 8;
        $token = session('api_token');

        try {
            // Siapkan query parameters, hanya kirim yang tidak kosong
            $queryParams = array_filter([
                'keyword' => $keyword,
                'department' => $department,
                'category' => $category,
            ]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token
            ])->get(config('app.back_end_base_url') . '/api/product', $queryParams);

            if (in_array('Unauthorized!', $response->json('errors') ?? [])) {
                return redirect()->route('login')->with('error', 'Session expired. Please log in again.');
            }

            if ($response->successful() && $response->json('errors') === null) {
                $allProducts = collect($response->json('data'));

                $total = $allProducts->count();
                $products = $allProducts->slice(($page - 1) * $perPage, $perPage)->values();
                $totalPages = ceil($total / $perPage);

                $pagination = [
                    'total_pages' => $totalPages,
                    'current_page' => $page,
                    'perPage' => $perPage,
                    'total' => $total,
                ];

                return view('catalog', [
                    'products' => $products,
                    'pagination' => $pagination,
                ]);
            } else {
                return redirect()->back()->with('error', 'Failed to fetch products.');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while fetching products.');
        }
    }

    public function getByImage(Request $request)
{
    $page = $request->query('page', 1);
    $perPage = 8;
    $token = session('api_token');

    try {
        // Make sure file is uploaded
        if (!$request->hasFile('image') || !$request->file('image')->isValid()) {
            return redirect()->back()->with('error', 'Please upload a valid image.');
        }

        $image = $request->file('image');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->attach(
            'image',                      
            file_get_contents($image),
            $image->getClientOriginalName()
        )->post(config('app.back_end_base_url') . '/api/product/get-by-image');

        if (in_array('Unauthorized!', $response->json('errors') ?? [])) {
            return redirect()->route('login')->with('error', 'Session expired. Please log in again.');
        }

        if ($response->successful() && $response->json('errors') === null) {
            $allProducts = collect($response->json('data'));

            $total = $allProducts->count();
            $products = $allProducts->slice(($page - 1) * $perPage, $perPage)->values();
            $totalPages = ceil($total / $perPage);

            $pagination = [
                'total_pages' => $totalPages,
                'current_page' => $page,
                'perPage' => $perPage,
                'total' => $total,
            ];

            return view('catalog', [
                'products' => $products,
                'pagination' => $pagination,
            ]);
        } else {
            return redirect()->back()->with('error', 'Failed to fetch products.');
        }
    } catch (\Exception $e) {
        return redirect()->back()->with('error', 'An error occurred while fetching products.');
    }
}


    public function detailProduct($id)
    {
        Log::info('ID yang diterima:', ['id' => $id]);
        $token = session('api_token');

        try {
            $url = config('app.back_end_base_url') . '/api/product/detail/' . $id;
            Log::info('Memanggil URL:', ['url' => $url]);
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token
            ])->get(config('app.back_end_base_url') . '/api/product/detail/' . $id);

            if (in_array('Unauthorized!', $response->json('errors') ?? [])) {
                return redirect()->route('login')->with('error', 'Session expired. Please log in again.');
            }

            // Cek apakah HTTP status 200
            if ($response->successful() && $response->json('errors') === null) {
                $product = $response->json('data');

                return view('detail_product', compact('product'));
            }
            return redirect()->route('landing')->with('error', 'Product not found or cannot be accessed.');

        } catch (\Exception $e) {
            Log::error('Detail Product Error: ' . $e->getMessage());
            return redirect()->route('landing')->with('error', 'An error occurred while fetching product details.');
        }
    }
}