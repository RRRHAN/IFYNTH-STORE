@extends('layout.master')
@section('container')
    <main>
        <!-- Page banner area start here -->
        <section class="page-banner bg-image"></section>

        <!-- cart page area start here -->
        <section class="cart-page pt-30 pb-130">
            <div class="container">
                @if (!empty($cartItems) && count($cartItems) > 0)
                    <!-- Shopping Cart - Desktop -->
                    <div class="shopping-cart radius-10 bor sub-bg">
                        <div
                            class="column-labels py-3 px-4 d-flex justify-content-between align-items-center fw-bold text-white text-uppercase">
                            <label class="product-details">Product</label>
                            <label class="product-price">Price</label>
                            <label class="product-quantity">Quantity</label>
                            <label class="product-line-price">Total</label>
                            <label class="product-removal">Edit</label>
                        </div>

                        @foreach ($cartItems['Items'] as $item)
                            <div class="product p-4 bor-top bor-bottom d-flex justify-content-between align-items-center">
                                <div class="product-details d-flex align-items-center">
                                    @if (
                                        !empty($item['Product']['ProductImages']) &&
                                            is_array($item['Product']['ProductImages']) &&
                                            isset($item['Product']['ProductImages'][0]['URL']))
                                        <img src="{{ url(config('app.back_end_base_url') . '/api' . $item['Product']['ProductImages'][0]['URL']) }}"
                                            alt="image">
                                    @else
                                        <p>No image available</p>
                                    @endif

                                    <h4 class="ps-4 text-capitalize">{{ $item['Product']['Name'] }} ({{ $item['Size'] }})
                                    </h4>
                                </div>
                                <div class="product-price">Rp.{{ number_format($item['Price']) }}</div>
                                <div class="product-quantity">
                                    <form method="POST"
                                        action="{{ route('update.Cart', ['product_id' => $item['ProductID'], 'cart_item_id' => $item['ID']]) }}"
                                        class="product-quantity">
                                        @csrf
                                        <input type="hidden" name="size" value="{{ $item['Size'] }}">
                                        <input type="button" value="-" class="qtyminus minus">
                                        <input type="text" name="quantity" value="{{ $item['Quantity'] }}" class="qty"
                                            readonly>
                                        <input type="button" value="+" class="qtyplus plus">
                                    </form>
                                </div>
                                <div class="product-line-price">
                                    Rp.{{ number_format($item['Price'] * $item['Quantity']) }}</div>
                                <div class="product-removal">
                                    <form
                                        action="{{ route('delete.Item', ['id' => $item['ID'], 'quantity' => $item['Quantity']]) }}"
                                        method="POST">
                                        @csrf
                                        <button type="submit" class="remove-product">
                                            <i class="fa-solid fa-x heading-color"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        @endforeach
                    </div>
                    <!-- Shopping Cart - Mobile -->
                    <div class="shopping-cart mobile-view bor sub-bg">
                        @foreach ($cartItems['Items'] as $item)
                            <div class="product p-4 bor-bottom">
                                <div class="product-details d-flex align-items-center">
                                    @if (
                                        !empty($item['Product']['ProductImages']) &&
                                            is_array($item['Product']['ProductImages']) &&
                                            isset($item['Product']['ProductImages'][0]['URL']))
                                        <img src="{{ url(config('app.back_end_base_url') . '/api' . $item['Product']['ProductImages'][0]['URL']) }}"
                                            alt="image">
                                    @else
                                        <p>No image available</p>
                                    @endif
                                    <h4 class="ps-4 text-capitalize">{{ $item['Product']['Name'] }} ({{ $item['Size'] }})
                                    </h4>
                                </div>
                                <div class="product-price">Rp.{{ number_format($item['Price']) }}</div>
                                <div class="product-quantity">
                                    <form method="POST"
                                        action="{{ route('update.Cart', ['product_id' => $item['ProductID'], 'cart_item_id' => $item['ID']]) }}"
                                        class="product-quantity">
                                        @csrf
                                        <input type="hidden" name="size" value="{{ $item['Size'] }}">
                                        <input type="button" value="-" class="qtyminus minus">
                                        <input type="text" name="quantity" value="{{ $item['Quantity'] }}"
                                            class="qty" readonly>
                                        <input type="button" value="+" class="qtyplus plus">
                                    </form>
                                </div>
                                <div class="product-line-price">
                                    Rp.{{ number_format($item['Price'] * $item['Quantity']) }}</div>
                                <div class="product-removal">
                                    <form
                                        action="{{ route('delete.Item', ['id' => $item['ID'], 'quantity' => $item['Quantity']]) }}"
                                        method="POST">
                                        @csrf
                                        <button type="submit" class="remove-product">
                                            <i class="fa-solid fa-x heading-color"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        @endforeach
                    </div>
                    @include('components.shipper-form')
                @else
                    <p class="text-center text-white">Your cart is empty.</p>
                @endif
                @if (!empty($cartItems) && isset($cartItems['TotalPrice']))
                    <div class="totals">
                        <div class="totals-item theme-color float-end mt-3">
                            <!-- Cart Total -->
                            <span class="fw-bold text-uppercase py-2">Cart total =</span>
                            <div id="totalDisplay" class="totals-value d-inline py-2 pe-2">
                                Rp.{{ number_format($cartItems['TotalPrice']) }}
                            </div>

                            <!-- Shipping Cost -->
                            <div id="shippingCostDisplay" style="display:none;">
                                <span class="fw-bold text-uppercase py-2">Shipping Cost =</span>
                                <div id="shippingCostAmount" class="totals-value d-inline py-2 pe-2"></div>
                            </div>

                            <!-- Grand Total -->
                            <div id="grandTotalDisplay" style="display:none;">
                                <span class="fw-bold text-uppercase py-2">GRANDTOTAL =</span>
                                <div id="grandTotalAmount" class="totals-value d-inline py-2 pe-2"></div>
                            </div>

                            <!-- Checkout Button -->
                            <a href="#" id="checkoutBtn" class="btn-one py-2 px-4" data-bs-toggle="modal"
                                data-bs-target="#shippingModal">
                                <span>Checkout</span>
                            </a>
                        </div>
                    </div>
                @endif
            </div>
        </section>
        <!-- cart page area end here -->
    </main>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            // Temukan semua tombol plus dan minus
            document.querySelectorAll('.qtyplus').forEach(button => {
                button.addEventListener('click', function() {
                    let input = this.previousElementSibling;
                    let value = parseInt(input.value, 10);
                    if (!isNaN(value)) {
                        input.value = value + 1;
                        this.closest('form').submit();
                    }
                });
            });

            document.querySelectorAll('.qtyminus').forEach(button => {
                button.addEventListener('click', function() {
                    let input = this.nextElementSibling;
                    let value = parseInt(input.value, 10);
                    if (!isNaN(value) && value > 1) {
                        input.value = value - 1;
                        this.closest('form').submit();
                    }
                });
            });
        });
    </script>

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const checkoutBtn = document.getElementById("checkoutBtn");
            const shipperForm = document.getElementById("shipperForm");
            const form = document.getElementById("formShip");
            checkoutBtn.addEventListener("click", function(e) {
                e.preventDefault();
                sessionStorage.setItem('preloader', false);

                if (shipperForm.style.display === "block") {
                    form.submit();
                } else {
                    shipperForm.style.display = "block";
                }
            });
        });
    </script>
@stop
