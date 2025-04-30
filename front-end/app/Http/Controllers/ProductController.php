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
        $perPage = 12; // Tentukan jumlah item per halaman
        $token = session('api_token');

        try {
            // Ambil data produk dari API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token
            ])->get('http://localhost:7777/product', [
                        'department' => $department
                    ]);

            if ($response->successful() && $response->json('errors') === null) {
                $allProducts = collect($response->json('data')); // Koleksi produk dari response

                // Hitung produk untuk pagination
                $total = $allProducts->count();
                $products = $allProducts->slice(($page - 1) * $perPage, $perPage)->values(); // Ambil produk sesuai halaman

                // Hitung total halaman
                $totalPages = ceil($total / $perPage);

                // Buat objek pagination
                $pagination = [
                    'total_pages' => $totalPages,
                    'current_page' => $page,
                    'perPage' => $perPage,
                    'total' => $total,
                ];

                return view('catalog', ['products' => $products, 'pagination' => $pagination]);
            } else {
                return redirect()->back()->with('error', 'Failed to fetch products.');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while fetching products.');
        }
    }

    public function fetchAll(Request $request)
{
    $keyword = $request->query('keyword');
    $department = $request->query('department');
    $category = $request->query('category');
    $page = $request->query('page', 1);
    $perPage = 12;
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
        ])->get('http://localhost:7777/product', $queryParams);

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
            $url = 'http://localhost:7777/product/detail/' . $id;
            Log::info('Memanggil URL:', ['url' => $url]);
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token
            ])->get('http://localhost:7777/product/detail/' . $id);

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