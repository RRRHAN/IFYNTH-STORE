@extends('layout.master')
@section('container')
    <main>
        <section class="shop-single mt-10 pt-200 pb-130">
            <div class="container">
                <div class="product-details-single pb-40">
                    <div class="row g-4">
                        <div class="col-lg-5">
                            <div class="image img">
                                <div class="swiper shop-single-slide">
                                    @if (isset($product['ProductImages']) && count($product['ProductImages']) > 0)
                                    <div class="swiper-wrapper">
                                        @foreach ($product['ProductImages'] as $image)
                                            <div class="swiper-slide">
                                                <img src="{{ url('http://localhost:7777'. $image['URL']) }}" alt="{{ $product['Name'] }}">
                                            </div>
                                        @endforeach
                                    </div>
                                @else
                                    <p>No images available.</p>
                                @endif
                                
                                </div>
                                <div class="mt-3 swiper shop-slider-thumb">
                                    <div class="swiper-wrapper">
                                        @if (isset($product['ProductImages']) && count($product['ProductImages']) > 0)
                                            @foreach ($product['ProductImages'] as $image)
                                                <div class="swiper-slide slide-smoll">
                                                    <img src="{{ url('http://localhost:7777'. $image['URL']) }}" alt="{{ $product['Name'] }}">
                                                </div>
                                            @endforeach
                                        @else
                                            <p>No images available.</p>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-7">
                            <div class="content h24">
                                <h3 class="pb-2 primary-color">{{ $product['Name'] }}</h3>
                                <h2 class="pb-3">
                                    <del>Rp {{ number_format($product['Price'] + 20000, 0, ',', '.') }}</del>
                                    <span class="ml-10">Rp
                                        {{ number_format($product['Price'], 0, ',', '.') }}</span>
                                </h2>
                                <h4 class="pb-2 primary-color">Product Description</h4>
                                <p class="product-description text-justify mb-10">{!! nl2br(e($product['Description'])) !!}</p>
                            </div>

                            <div class="row">
                                <div class="col-lg-8">
                                    <div class="details-area">
                                        <div class="category flex-wrap mt-4 d-flex py-3 bor-top">
                                            <h4 class="pe-3">Categories :</h4>
                                            <a href="#" class="primary-hover">{{ $product['Category'] }}</a>
                                        </div>
                                        <div class="category flex-wrap d-flex py-3 bor-top bor-bottom">
                                            <h4 class="pe-3">Department :</h4>
                                            <a href="#" class="primary-hover">{{ $product['Department'] }}</a>
                                        </div>

                                        <div class="cart-wrp py-4">
                                            <div class="cart-quantity">
                                                <form id='cart-form' method='POST' action="">
                                                    @csrf
                                                    <div class="cart-wrp py-4">
                                                        <div class="cart-quantity">
                                                            <input type='button' value='-' class='qtyminus minus'>
                                                            <input type='text' name='quantity' value='1'
                                                                class='qty'>
                                                            <input type='button' value='+' class='qtyplus plus'>
                                                        </div>
                                                    </div>
                                                    <!-- Opsi Pilihan Ukuran -->
                                                    <!-- Opsi Pilihan Ukuran -->
                                                    <div class="size-options">
                                                        <h4 class="pe-3 mb-1">Select Size:</h4>
                                                        <div class="short">
                                                            <select name="size" class="mb-5" required>
                                                                @if (isset($product['StockDetails']) && count($product['StockDetails']) > 0)
                                                                    @foreach ($product['StockDetails'] as $stock)
                                                                        @if ($stock['Stock'] > 0)
                                                                            <option value="{{ $stock['Size'] }}">
                                                                                {{ $stock['Size'] }}
                                                                                ({{ $stock['Stock'] }} in stock)
                                                                            </option>
                                                                        @endif
                                                                    @endforeach
                                                                @else
                                                                    <option disabled>No stock available</option>
                                                                @endif
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <!-- Tombol Submit -->
                                                    <button type="submit"
                                                        class="d-block text-center btn-one mt-50 add-to-cart">
                                                        <span><i class="fa-solid fa-basket-shopping pe-2"></i> Add to
                                                            cart</span>
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <!-- Modal Notifikasi -->
    <div class="modal fade" id="loginModalCart" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="loginModalLabel">Alert</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    You must Sign-in first to add product.
                </div>
                <div class="modal-footer">
                    <a href="{{ route('login') }}" class="btn btn-primary">Login</a>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            // Cek apakah user sudah login
            var userLoggedIn = @json(session('user_logged_in', false));
            var loginModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('loginModalCart'));

            document.body.addEventListener("click", function(event) {
                var target = event.target.closest(
                ".add-to-cart"); // Cek jika yang diklik adalah tombol Add to Cart

                if (target && !userLoggedIn) {
                    event.preventDefault(); // Mencegah submit form
                    loginModal.show(); // Tampilkan modal
                }
            });
        });
    </script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            // Temukan semua tombol plus dan minus
            document.querySelectorAll('.qtyplus').forEach(button => {
                button.addEventListener('click', function() {
                    let input = this.previousElementSibling; // Ambil input quantity
                    let value = parseInt(input.value, 10);
                    if (!isNaN(value)) {
                        input.value = value + 1; // Tambah 1
                    }
                });
            });

            document.querySelectorAll('.qtyminus').forEach(button => {
                button.addEventListener('click', function() {
                    let input = this.nextElementSibling; // Ambil input quantity
                    let value = parseInt(input.value, 10);
                    if (!isNaN(value) && value > 1) {
                        input.value = value - 1; // Kurangi 1 (minimal 1)
                    }
                });
            });
        });
    </script>

@stop
