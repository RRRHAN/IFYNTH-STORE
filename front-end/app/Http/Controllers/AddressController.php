<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Collection;

class AddressController extends Controller
{


    public function addAddress(Request $request)
    {
        $token = session('api_token');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->post(config('app.back_end_base_url') . '/api/address', [
                    'destinationId' => $request->destination_id,
                    'RecipientsName' => $request->recipient_name,
                    'RecipientsNumber' => $request->recipient_number,
                    'address' => $request->address,
                    'zipCode' => $request->zip_code,
                    'destinationLabel' => $request->destination_label,
                ]);

        if ($response->successful()) {
            return redirect()->back()->with('success', 'Add address successfully.');
        }
        return redirect()->back()->with('error', 'Failed to add address.');
    }

    public function getAddress(Request $request): Collection
    {
        $token = session('api_token');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get(config('app.back_end_base_url') . '/api/address');

        if ($response->successful()) {
            return collect($response->json('data'));
        }

        return collect();
    }

    public function deleteAddress($id)
    {
        $token = session('api_token');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->delete(config('app.back_end_base_url') . '/api/address/' . $id);

        if ($response->successful()) {
            return redirect()->back()->with('success', 'Alamat berhasil dihapus.');
        }

        return redirect()->back()->with('error', 'Gagal menghapus alamat.');
    }

    public function updateAddress($id, Request $request)
    {
        $token = session('api_token');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->put(config('app.back_end_base_url') . '/api/address/' . $id, [
                    'destinationId' => $request->destination_id,
                    'RecipientsName' => $request->recipient_name,
                    'RecipientsNumber' => $request->recipient_number,
                    'address' => $request->address,
                    'zipCode' => $request->zip_code,
                    'destinationLabel' => $request->destination_label,
                ]);

        if ($response->successful()) {
            return redirect()->back()->with('success', 'updated address successfully.');
        }
        return redirect()->back()->with('error', 'Failed to updated address.');
    }

}