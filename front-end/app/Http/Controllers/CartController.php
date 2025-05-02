<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    public function AddtoCart(Request $request, $product_id)
    {
        $token = session('api_token');

        $validate = $request->validate([
            'size' => "required",
            'quantity' => "required"
        ]);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
            ])->asJson()->post('http://localhost:7777/cart', ['product_id' => $product_id, 'size' => $validate['size'], 'quantity' => (int) $validate['quantity']]);

            if ($response->successful()) {
                $totalCart = session('total_cart', 0);
                $totalCart += $validate['quantity'];

                session()->put('total_cart', $totalCart);
                session()->flash('success', 'Item added to cart');
                return redirect()->back();
            } else {
                $errors = $response->json()['errors'] ?? ['Failed to added item'];
                session()->flash('error', $errors[0]);
                return redirect()->back();
            }

        } catch (\Exception $e) {
            session()->flash('error', $e->getMessage());
            return redirect()->back();
        }

    }

    public function getCart()
    {
        $token = session('api_token');

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token
            ])->get('http://localhost:7777/cart');

            if ($response->successful() && $response->json('errors') === null) {
                $cart = collect($response->json()['data']);
                session()->put('total_cart', $cart['TotalQuantity']);

                return view('cart', ['cartItems' => $cart]);
            } else {
                $errors = $response->json()['errors'] ?? ['Failed to get cart'];
                return view('cart');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function updateCart(Request $request, $product_id, $cart_item_id)
    {
        $token = session('api_token');
    
        $request->validate(
            [
                'size' => 'required',
                'quantity' => 'required'
            ]
        );
    
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token
            ])->put('http://localhost:7777/cart', [
                'product_id' => $product_id, 
                'cart_item_id' => $cart_item_id,
                'size' => $request['size'],
                'quantity' => (int) $request['quantity']
            ]);
    
            if ($response->successful() && $response->json('errors') === null) {
                return redirect()->back();
            } else {
                $errors = $response->json()['errors'] ?? ['Failed to update item'];
                session()->flash('error', $errors[0]);
                return redirect()->back();
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    

    public function deleteItem($id)
    {
        $token = session('api_token');

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token
            ])->delete('http://localhost:7777/cart/delete', ['cart_item_id' => $id]);

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