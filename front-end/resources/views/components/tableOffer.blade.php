<div class="tab-pane fade" id="my-offer" role="tabpanel">
    <h5 class="mb-4">Recent my-offer</h5>

    <div style="overflow-x: auto;">
        <table class="table">
            <thead>
                <tr class="text-center align-middle">
                    <th scope="col">no</th>
                    <th scope="col">Product Image</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($products ?? [] as $index => $product)
                    <tr class="text-center align-middle">
                        <th scope="row">{{ $index + 1 }}</th>
                        <td>
                            @php
                                $file = $product['Files'][0]['URL'] ?? null;
                                $isVideo = $file && preg_match('/\.(mp4|webm|ogg)$/i', $file);
                            @endphp
                            @if ($file)
                                @if ($isVideo)
                                    <video width="80" height="80"
                                        style="object-fit: cover; border-radius: 8px; pointer-events: none;" muted
                                        preload="metadata">
                                        <source src="{{ url('http://localhost:7777' . $file) }}" type="video/mp4">
                                        Your browser does not support the video tag.
                                    </video>
                                @else
                                    <img src="{{ url('http://localhost:7777' . $file) }}" alt="image" width="80"
                                        height="80" style="object-fit: cover; border-radius: 8px;">
                                @endif
                            @else
                                <p>No image available</p>
                            @endif
                        </td>
                        <td>
                            <div>{{ $product['Name'] ?? '-' }}</div>
                        </td>
                        <td>{{ number_format($product['Price'] ?? 0) }}</td>
                        <td>{{ ucfirst($product['Status'] ?? '-') }}</td>
                        <td>
                            <a href="#" class="btn btn-sm btn-primary view-detail-btn" data-bs-toggle="modal"
                                data-bs-target="#productDetailModal" data-name="{{ $product['Name'] ?? '-' }}"
                                data-price="{{ number_format($product['Price'] ?? 0, 0, ',', '.') }}"
                                data-description="{{ $product['Description'] ?? '-' }}"
                                data-status="{{ ucfirst($product['Status'] ?? '-') }}"
                                data-images='@json(collect($product['Files'] ?? [])->map(function ($file) {
                                        return url('http://localhost:7777' . ($file['URL'] ?? ''));
                                    }))'>
                                <i class="fas fa-eye"></i>
                            </a>
                            <a>
                                <form action="{{ route('delete.offer', ['id' => $product['ID']]) }}" method="POST"
                                    onsubmit="return confirm('Are you sure you want to delete this offer?');">
                                    @csrf
                                    <button type="submit" class="btn btn-sm btn-danger">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </form>
                            </a>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="text-center">No offers available.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
