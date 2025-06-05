<div class="tab-pane fade" id="address" role="tabpanel">
    <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="text-dark">My Address</h5>
            <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#addAddressModal">
                <i class="fas fa-plus me-2"></i> Add New Address
            </button>
        </div>

        <h5 class="mb-3 text-dark">List My Address</h5>

        @forelse ($addresses as $address)
            <div class="address-item shadow-sm">
                <div class="address-item-header">
                    <div>
                        <strong>{{ $address['RecipientsName'] ?? 'Name not available' }}</strong>
                        (+62)
                        {{ $address['RecipientsNumber'] ?? 'Number not available' }}
                    </div>
                    <div class="address-item-actions">
                        <button class="btn btn-link p-0 text-decoration-none edit-address-btn" data-bs-toggle="modal"
                            data-bs-target="#updateAddressModal" data-address="{{ json_encode($address) }}">
                            Edit
                        </button>
                        <a href="{{ route('deleteAddress', ['id' => $address['ID']]) }}">Delete</a>
                    </div>
                </div>
                <div class="address-item-details">
                    {{ $address['Address'] ?? '' }}<br>
                    {{ $address['DestinationLabel'] ?? '' }}, {{ $address['ZipCode'] ?? '' }}
                </div>
            </div>
        @empty
            <div class="alert alert-secondary text-center" role="alert">
                No addresses available.
            </div>
        @endforelse

    </div>
</div>
@include('components.addressModal')
@include('components.updateAddressModal')
