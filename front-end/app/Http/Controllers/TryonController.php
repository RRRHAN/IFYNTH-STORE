<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TryonController extends Controller
{
    public function tryon(Request $request)
    {
        $personImage = $request->file('person_image');
        $garmentImage = $request->file('garment_image');
        $seed = $request->input('seed');
        $randomizeSeed = $request->input('randomize_seed', false);

        // Check if images are provided
        if (!$personImage || !$garmentImage) {
            return response()->json(['error' => 'Empty image'], 400);
        }

        // Send the images to Python service
        try {
            $response = Http::attach('person_image', file_get_contents($personImage), 'person_image.jpg')
                ->attach('garment_image', file_get_contents($garmentImage), 'garment_image.jpg')
                ->post(env('http://127.0.0.1:5555') . '/tryon', [
                    'seed' => $seed,
                    'randomize_seed' => $randomizeSeed
                ]);

            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'result_image' => $data['result_image'],
                    'info' => $data['info']
                ]);
            } else {
                return response()->json(['error' => 'Failed to process the try-on'], 500);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error in connecting to Python service: ' . $e->getMessage()], 500);
        }
    }
}