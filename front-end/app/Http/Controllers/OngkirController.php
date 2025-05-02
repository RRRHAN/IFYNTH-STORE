<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use GuzzleHttp\Client;
class OngkirController extends Controller
{

    public function searchDestination(Request $request)
    {
        $searchQuery = $request->input('q');

        // Pastikan query memiliki panjang minimal 3 karakter
        if (strlen($searchQuery) < 3) {
            return response()->json(['error' => 'Please enter at least 3 characters.'], 400);
        }

        $client = new Client();

        try {
            $response = $client->get('https://api-sandbox.collaborator.komerce.id/tariff/api/v1/destination/search', [
                'query' => [
                    'keyword' => $searchQuery,
                ],
                'headers' => [
                    'x-api-key' => '5feEw06A622dbf37ec9fbf96Ri8SnpMK',
                ]
            ]);

            $data = json_decode($response->getBody(), true);

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching data from RajaOngkir'], 500);
        }
    }

    public function getShippingCost(Request $request)
    {
        $receiverDestinationId = $request->input('receiver_destination_id');
        $weight = $request->input('weight');
        $itemValue = $request->input('item_value');

        $apiKey = '5feEw06A622dbf37ec9fbf96Ri8SnpMK';

        $response = Http::withHeaders([
            'x-api-key' => $apiKey
        ])->get('https://api-sandbox.collaborator.komerce.id/tariff/api/v1/calculate', [
                    'shipper_destination_id' => '30711',
                    'receiver_destination_id' => $receiverDestinationId,
                    'weight' => $weight,
                    'item_value' => $itemValue,
                    'cod' => 'no'
                ]);

        if ($response->successful()) {
            return response()->json($response->json());
        } else {
            return response()->json([
                'error' => 'Failed to retrieve shipping cost',
                'status' => $response->status(),
                'message' => $response->body(),
            ], $response->status());
        }
    }
}