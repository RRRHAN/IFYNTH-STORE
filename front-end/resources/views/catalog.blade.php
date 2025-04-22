@extends('layout.master')
@section('container')
<main>
    <!-- Page banner area start here -->
    <section class="page-banner bg-image pt-30" data-background="assets/images/banner/inner-banner.jpg">
        <div class="container">
            <h2 class="wow fadeInUp mb-15" data-wow-duration="1.1s" data-wow-delay=".1s">{{ $department }} Catalog</h2>
            <div class="breadcrumb-list wow fadeInUp" data-wow-duration="1.3s" data-wow-delay=".3s">
                <a href="/landing" class="primary-hover"><i class="fa-solid fa-house me-1"></i> Home <i
                        class="fa-regular text-white fa-angle-right"></i></a>
                <span>{{ $department }}</span>
            </div>
        </div>
    </section>
    <!-- Page banner area end here -->

    <!-- Product area start here -->
    <section class="product-area pt-30 pb-130">
        <div class="container">
            <div class="pb-20 bor-bottom shop-page-wrp d-flex justify-content-between align-items-center mb-65">
                <p class="fw-600">Showing 1–12 of 17 results</p>
                <div class="short">
                    <select name="shortList" id="shortList">
                        <option value="0">Short by popularity</option>
                    </select>
                </div>
            </div>
            <div class="row g-4">
                <div class="col-xl-12 col-lg-8">
                    <div class="row g-4">
                        @foreach ($products as $product)
                            <div class="col-xl-3 col-lg-3 col-md-6">
                                <div class="product__item bor">
                                    <a href="{{ route('product.detail', ['product_id' => $product['id']]) }}" class="wishlist"><i
                                            class="fa-regular fa-heart"></i></a>

                                    <a href="{{ route('product.detail', ['product_id' => $product['id']]) }}" class="product__image pt-20 d-block">
                                        @if (!empty($product['images']))
                                            <img class="font-image"
                                                src="{{ asset($product['images'][0] ?? 'default-image.jpg') }}"
                                                alt="{{ $product['name'] }}">
                                            <img class="back-image"
                                                src="{{ asset($product['images'][1] ?? $product['images'][0] ?? 'default-image.jpg') }}"
                                                alt="{{ $product['name'] }}">
                                        @else
                                            <img class="font-image" src="{{ asset('default-image.jpg') }}" alt="Default Image">
                                            <img class="back-image" src="{{ asset('default-image.jpg') }}" alt="Default Image">
                                        @endif
                                    </a>

                                    <div class="product__content">
                                        <h4 class="mb-15">
                                            <a class="primary-hover"
                                                href="{{ route('product.detail', ['product_id' => $product['id']]) }}">{{ Str::limit($product['name'], 20, '...') }}
                                                </a>
                                        </h4>
                                        <del>Rp {{ number_format($product['price'] + 20000, 0, ',', '.') }}</del>
                                        <span class="primary-color ml-10">Rp
                                            {{ number_format($product['price'], 0, ',', '.') }}</span>
                                    </div>

                                    <a class="product__cart d-block bor-top" href="{{ route('product.detail', ['product_id' => $product['id']]) }}">
                                        <i class="fa-regular fa-cart-shopping primary-color me-1"></i> <span>Add to
                                            cart</span>
                                    </a>
                                </div>
                            </div>
                        @endforeach
                    </div>
                    <div class="pagi-wrp mt-65">
                        <a href="shop-2.html#0" class="pagi-btn">01</a>
                        <a href="shop-2.html#0" class="pagi-btn active">02</a>
                        <a href="shop-2.html#0" class="pagi-btn ">03</a>
                        <a href="shop-2.html#0" class="fa-regular ms-2 primary-hover fa-angle-right"></a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Product area end here -->
</main>
@stop