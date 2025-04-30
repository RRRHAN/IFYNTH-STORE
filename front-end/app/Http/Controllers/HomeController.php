<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class HomeController extends Controller
{
    public function landing(Request $request)
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
                $allProducts = collect($response->json('data'))
                ->sortByDesc('created_at')
                ->values();
    
                $total = $allProducts->count();
                $products = $allProducts->slice(($page - 1) * $perPage, $perPage)->values();
                $totalPages = ceil($total / $perPage);
    
                $pagination = [
                    'total_pages' => $totalPages,
                    'current_page' => $page,
                    'perPage' => $perPage,
                    'total' => $total,
                ];
    
                return view('landing', [
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

    public function dashboard(Request $request)
    {
        $keyword = $request->query('keyword');
        $token = session('api_token');
    
        $cusproductController = new CustomerProductController();
        $result = $cusproductController->fetchOffers($request);
    
        // Ambil elemen dari koleksi
        $products = $result->get('products');
        $pagination = $result->get('pagination');
    
        return view('dashboard', [
            'products' => $products,
            'pagination' => $pagination,
        ]);
    }
    
}