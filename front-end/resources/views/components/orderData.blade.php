<div class="tab-pane fade" id="my-order" role="tabpanel">
    <h5 class="mb-4">Recent My Orders</h5>

    @forelse ($transactions ?? [] as $transaction)
        <div class="order-card shadow-sm">
            <div class="order-header">
                <div class="order-shop-info">
                    <span class="star-badge">Star+</span>
                    <span class="shop-name">IFYNTH Store</span>
                </div>
                <div class="order-status-msg mt-2 mt-md-0">
                    @if ($transaction['Status'] === 'delivered' && ($transaction['IsReviewedByCustomer'] ?? false))
                        The order has arrived at the destination address. Received by the person concerned. <span
                            class="status-badge">HAS BEEN ASSESSED</span>
                    @elseif ($transaction['Status'] === 'completed')
                        Order has been completed.
                    @elseif ($transaction['Status'] === 'cancelled')
                        Order cancelled.
                    @elseif ($transaction['Status'] === 'process')
                        The order is in transit.
                    @elseif ($transaction['Status'] === 'paid')
                        Have made payment, waiting for store confirmation.
                    @elseif ($transaction['Status'] === 'pending')
                        Waiting for payment.
                    @elseif ($transaction['Status'] === 'draft')
                        Order placed, awaiting store confirmation.
                    @else
                        Status: {{ ucfirst($transaction['Status'] ?? '-') }}
                    @endif
                </div>
            </div>

            <div class="order-body">
                @forelse ($transaction['TransactionDetails'] ?? [] as $key => $detail)
                    {{-- Display only the first product by default, hide others --}}
                    <div class="product-item-order {{ $key >= 1 ? 'hidden-product-item-order' : '' }}">
                        {{-- Struktur HTML sudah dikembalikan ke tanpa product-main-info --}}
                        <div class="product-img-wrapper">
                            <img src="{{ url(config('app.back_end_base_url') . '/api' . ($detail['Product']['ProductImages'][0]['URL'] ?? '/placeholder.png')) }}"
                                class="product-img" alt="{{ $detail['Product']['Name'] ?? 'Product Image' }}">
                        </div>
                        <div class="product-details-order">
                            <div class="product-name">{{ $detail['Product']['Name'] ?? 'Nama Produk Tidak Diketahui' }}
                            </div>
                            <div class="product-variation">Variasi: {{ $detail['Size'] ?? 'Ukuran Tidak Diketahui' }}
                                {{ $detail['Color'] ?? '' }}</div>
                            <div class="product-quantity">x{{ $detail['Quantity'] ?? 1 }}</div>
                        </div>
                        <div class="product-price-info">
                            @if (($detail['Product']['OriginalPrice'] ?? 0) > ($detail['Product']['Price'] ?? 0))
                                <div class="original-price">
                                    Rp{{ number_format($detail['Product']['OriginalPrice'] ?? 0) }}</div>
                            @endif
                            <div class="final-price">Rp{{ number_format($detail['Product']['Price'] ?? 0) }}</div>
                            @if (count($transaction['TransactionDetails'] ?? []) > 1)
                                <a href="{{ route('product.detail', ['id' => $detail['Product']['ID']]) }}"
                                    class="btn btn-buy-again btn-sm mt-2">
                                    Buy More
                                </a>
                            @endif
                        </div>
                    </div>
                @empty
                    <div class="text-center py-3 text-muted">There are no products in this order.</div>
                @endforelse

                {{-- Show "View All Products" button if there's more than one detail --}}
                @if (count($transaction['TransactionDetails'] ?? []) > 1)
                    <div class="text-center mt-3">
                        <button class="btn btn-sm btn-outline-secondary view-more-btn" type="button">
                            View All Products ({{ count($transaction['TransactionDetails']) - 1 }} more)
                            <i class="fas fa-chevron-down ms-2"></i>
                        </button>
                    </div>
                @endif
            </div> {{-- End of order-body --}}

            <div class="order-footer">
                <div class="total-order-section">
                    <span class="total-order-label">Order Total:</span>
                    <span class="total-order-amount">Rp{{ number_format($transaction['TotalAmount'] ?? 0) }}</span>
                </div>
                <div class="seller-review-status">
                    @if ($transaction['Status'] === 'delivered' && !($transaction['IsReviewedByCustomer'] ?? false))
                        Waiting for the Seller to provide value
                    @elseif ($transaction['Status'] === 'delivered' && ($transaction['IsReviewedByCustomer'] ?? false))
                        You have provided value.
                    @else
                    @endif
                </div>
                <div class="order-actions">
                    {{-- Tombol "Buy More" di footer HANYA jika ada 1 produk (tetap sama) --}}
                    @if (count($transaction['TransactionDetails'] ?? []) == 1)
                        @php
                            $firstDetail = $transaction['TransactionDetails'][0] ?? null;
                        @endphp
                        @if ($firstDetail)
                            <a href="{{ route('product.detail', ['id' => $firstDetail['Product']['ID']]) }}"
                                class="btn btn-buy-again">
                                Buy More
                            </a>
                        @endif
                    @endif

                    {{-- Tombol "Pay Now" (tetap sama) --}}
                    @if ($transaction['Status'] === 'pending')
                        <button class="btn btn-primary pay-now-btn" data-bs-toggle="modal"
                            data-bs-target="#paymentModal" data-transaction-id="{{ $transaction['ID'] }}"
                            data-total-amount="{{ number_format($transaction['TotalAmount'] ?? 0) }}"
                            data-payment-method="{{ $transaction['PaymentMethod'] ?? 'Bank Transfer' }}">
                            Pay Now
                        </button>
                    @endif
                    @if ($transaction['Status'] !== 'cancelled')
                        <button class="btn btn-secondary shipping-address-btn" data-bs-toggle="modal"
                            data-bs-target="#shippingAddressModal" data-transaction-id="{{ $transaction['ID'] }}"
                            data-recipient-name="{{ $transaction['ShippingAddress']['Name'] ?? 'N/A' }}"
                            data-phone-number="{{ $transaction['ShippingAddress']['PhoneNumber'] ?? 'N/A' }}"
                            data-address="{{ $transaction['ShippingAddress']['Address'] ?? 'N/A' }}"
                            data-zip-code="{{ $transaction['ShippingAddress']['ZipCode'] ?? 'N/A' }}"
                            data-destination-label="{{ $transaction['ShippingAddress']['DestinationLabel'] ?? 'N/A' }}"
                            data-courier="{{ $transaction['ShippingAddress']['Courir'] ?? 'N/A' }}"
                            data-status="{{ $transaction['Status'] ?? 'N/A' }}">
                            Shipping Address
                        </button>
                    @endif
                </div>
            </div>
        </div>
    @empty
        <div class="alert alert-secondary text-center" role="alert">
            No orders available.
        </div>
    @endforelse
</div>

@include('components.detailOrderModal')
