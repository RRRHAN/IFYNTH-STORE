<div class="tab-pane fade" id="address" role="tabpanel">
    <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="text-dark">My Address</h2>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addAddressModal">
                <i class="fas fa-plus me-2"></i> Add New Address
            </button>
        </div>

        <h5 class="mb-3 text-dark">List Address</h5>

        @foreach ($addresses as $address)
            <div class="address-item shadow-sm">
                <div class="address-item-header">
                    <div>
                        <strong>{{ $address['RecipientsName'] ?? 'Nama tidak tersedia' }}</strong>
                        (+62)
                        {{ $address['RecipientsNumber'] ?? 'Nomor tidak tersedia' }}
                    </div>
                    <div class="address-item-actions">
                        <button class="btn btn-link p-0 text-decoration-none edit-address-btn" data-bs-toggle="modal"
                            data-bs-target="#updateAddressModal" data-address="{{ json_encode($address) }}">
                            Ubah
                        </button>
                        <a href="{{ route('deleteAddress', ['id' => $address['ID']]) }}">Hapus</a>
                    </div>
                </div>
                <div class="address-item-details">
                    {{ $address['Address'] ?? '' }}<br>
                    {{ $address['DestinationLabel'] ?? '' }}, {{ $address['ZipCode'] ?? '' }}
                </div>
            </div>
        @endforeach

    </div>
    @include('components.addressModal')
    @include('components.updateAddressModal')
