<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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
            ])->get(config('app.back_end_base_url') . '/api/product', $queryParams);

            if (in_array('Unauthorized!', $response->json('errors') ?? [])) {
                return redirect()->route('login')->with('error', 'Session expired. Please log in again.');
            }

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
        $products = $result->get('products');

        $userController = new UserController();
        $user = $userController->getPersonal();

        $transactionController = new TransactionController();
        $transactionsResponse = $transactionController->getTransaction();

        $transactions = $transactionsResponse->getData(true)['transactions'] ?? [];

        return view('dashboard', [
            'products' => $products,
            'user' => $user,
            'transactions' => $transactions,
        ]);
    }

    public function countUnread(Request $request)
    {
        try {
            $token = session('api_token');

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token
            ])->get(config('app.back_end_base_url') .'/api/message/countUnread');

            if ($response->successful() && $response->json('errors') === null) {
                $unread = $response->json('data');
                return response()->json(['data' => $unread, 'errors' => null]);
            }

            return response()->json(['data' => 0, 'errors' => ['Failed to fetch unread count']], 500);
        } catch (\Exception $e) {
            return response()->json(['data' => 0, 'errors' => [$e->getMessage()]], 500);
        }
    }

}