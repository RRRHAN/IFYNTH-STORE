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
        $client = new Client();
        $addressId = $request->input('addressId');
        $weight = $request->input('weight');
        $itemValue = $request->input('item_value');

        $token = session("api_token");

        $response = $client->request('GET', config('app.back_end_base_url') . '/api/ongkir/cost', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json',
            ],
            'body' => json_encode([
                'addressId' => $addressId,
                'weight' => $weight,
                'ItemValue' => $itemValue,
            ]),
        ]);

        if ($response->getStatusCode() == 201) {
            $data = json_decode($response->getBody()->getContents(), true);
            return response()->json($data);
        } else {
            return response()->json([
                'error' => 'Failed to retrieve shipping cost',
                'status' => $response->getStatusCode(),
                'message' => $response->getBody()->getContents(),
            ], $response->getStatusCode());
        }
    }
}