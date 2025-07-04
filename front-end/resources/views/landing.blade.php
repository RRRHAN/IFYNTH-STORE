@extends('layout.master')
@section('container')
<main>
    <style>
        /* Custom CSS for slider - optional, for smoother transitions */
        .slider-item {
            transition: transform 1s ease-in-out, opacity 1s ease-in-out;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            pointer-events: none;
            /* Disable clicks on hidden slides */
        }

        .slider-item.active {
            opacity: 1;
            position: relative;
            /* Bring active slide to flow */
            pointer-events: auto;
            /* Enable clicks on active slide */
        }

        /* Hide scrollbar for slider if overflowing on small screens */
        .slider-container {
            overflow: hidden;
        }

        /* Custom CSS untuk slider - TETAP TIDAK DIUBAH */
        /* Pastikan kelas ini sama dengan di HTML dan JavaScript */
        .main-slider-item {
            transition: transform 1s ease-in-out, opacity 1s ease-in-out;
            position: absolute;
            /* Penting: agar slide bertumpuk */
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            /* Sembunyikan slide yang tidak aktif */
            pointer-events: none;
            /* Nonaktifkan klik pada slide yang tersembunyi */
        }

        .main-slider-item.active {
            opacity: 1;
            /* Tampilkan slide yang aktif */
            position: relative;
            /* Penting: agar slide aktif muncul di atas yang lain */
            pointer-events: auto;
            /* Aktifkan klik pada slide yang aktif */
        }

        /* Custom styles for dots - keeping w-3 h-3 as they are not standard Bootstrap utilities */
        .main-slider-dot {
            width: 12px;
            /* Approx w-3 */
            height: 12px;
            /* Approx h-3 */
        }

        /* Hide scrollbar for slider if overflowing on small screens (can also be handled by Bootstrap classes like overflow-hidden) */
        .slider-container {
            overflow: hidden;
        }
    </style>
    <!-- Banner area start here -->
    <section class="banner-area pb-130">
        <div class="container">
            <div class="position-relative w-100 rounded-3 shadow-lg overflow-hidden" style="padding-top: 56.25%;">
                <div id="main-banner-slider" class="position-absolute top-0 start-0 w-100 h-100 d-flex">
                    <div class="main-slider-item active flex-shrink-0 w-100">
                        <label for="search-image-upload" class="d-block w-100 h-100">
                            <img src="assets/images/banner/similar-image-feature.png" alt="Search Similar Image Feature" class="w-100 h-100 object-fit-cover">
                        </label>
                    </div>

                    <div class="main-slider-item flex-shrink-0 w-100">
                        <a href="/catalog" class="d-block w-100 h-100">
                            <img src="assets/images/banner/discount.png" alt="Discount Promo 20K" class="w-100 h-100 object-fit-cover">
                        </a>
                    </div>
                </div>

                <button id="main-slider-prev-btn" class="position-absolute start-0 top-50 translate-middle-y bg-dark text-white p-3 rounded-circle ms-2 border-0 opacity-75 hover-opacity-100">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button id="main-slider-next-btn" class="position-absolute end-0 top-50 translate-middle-y bg-dark text-white p-3 rounded-circle me-2 border-0 opacity-75 hover-opacity-100">
                    <i class="fas fa-chevron-right"></i>
                </button>

                <div id="main-slider-dots" class="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-2 mb-2">
                    <button class="main-slider-dot rounded-circle cursor-pointer bg-secondary"></button>
                    <button class="main-slider-dot rounded-circle cursor-pointer bg-secondary"></button>
                </div>
            </div>
            <div class="row g-4">
                <div class="col-lg-6">
                    <div class="banner__item wow fadeInUp">
                        <div class="image">
                            <img src="/assets/images/banner/IFY_banner-modified.png" alt="image">
                        </div>
                        <div class="banner__content">
                            <h1 class="wow fadeInUp text-dark" data-wow-delay=".2s">I FOUND YOU <br>
                                <span class="primary-color text-sm">product thrifting</span>
                            </h1>
                            <a class="btn-one wow fadeInUp mt-20" data-wow-delay=".3s"
                                href="{{ route('products.getAll', ['department' => 'IFY']) }}"><span>Shop
                                    Now</span></a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="banner__item wow fadeInUp">
                        <div class="image">
                            <img src="/assets/images/banner/NTH_banner-modified.png" alt="image">
                        </div>
                        <div class="banner__content">
                            <h1 class="wow fadeInUp text-dark" data-wow-delay=".2s">NO TIME TO HELL <br>
                                <span class="primary-color">our products</span>
                            </h1>
                            <a class="btn-one wow fadeInUp mt-20" data-wow-delay=".3s"
                                href="{{ route('products.getAll', ['department' => 'NTH']) }}"><span>Shop
                                    Now</span></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Banner area end here -->

    <!-- Category area start here -->
    <section class="category-area pb-130">
        <div class="container">
            <div class="sub-title wow fadeInUp text-center mb-65" data-wow-delay=".1s">
                <h3><span class="title-icon"></span> our top categories <span class="title-icon"></span>
                </h3>
            </div>
            <div class="swiper category__slider">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <div class="category__item text-center">
                            <a href="{{ route('products.getAll', ['category' => 'Shirt']) }}"
                                class="category__image d-block">
                                <div class="category-icon">
                                    <img src="/assets/images/category/shirt.png" alt="icon">
                                </div>
                            </a>
                            <h4 class="mt-30"><a
                                    href="{{ route('products.getAll', ['category' => 'Shirt']) }}">Shirt</a></h4>
                        </div>
                    </div>
                    <div class="swiper-slide">
                        <div class="category__item text-center">
                            <a href="{{ route('products.getAll', ['category' => 'T-Shirt']) }}"
                                class="category__image d-block">
                                <div class="category-icon">
                                    <img src="/assets/images/category/tshirt.png" alt="icon">
                                </div>
                            </a>
                            <h4 class="mt-30"><a
                                    href="{{ route('products.getAll', ['category' => 'T-Shirt']) }}">T-Shirt</a></h4>
                        </div>
                    </div>
                    <div class="swiper-slide">
                        <div class="category__item text-center">
                            <a href="{{ route('products.getAll', ['category' => 'Long Shirt']) }}"
                                class="category__image d-block">
                                <div class="category-icon">
                                    <img src="/assets/images/category/longshirt.png" alt="icon">
                                </div>
                            </a>
                            <h4 class="mt-30"><a
                                    href="{{ route('products.getAll', ['category' => 'Long Shirt']) }}">Long Shirt</a>
                            </h4>
                        </div>
                    </div>
                    <div class="swiper-slide">
                        <div class="category__item text-center">
                            <a href="{{ route('products.getAll', ['category' => 'Outetwear']) }}"
                                class="category__image d-block">
                                <div class="category-icon">
                                    <img src="/assets/images/category/outerwear.png" alt="icon">
                                </div>
                            </a>
                            <h4 class="mt-30"><a
                                    href="{{ route('products.getAll', ['category' => 'Outetwear']) }}">Outerwear</a>
                            </h4>
                        </div>
                    </div>
                    <div class="swiper-slide">
                        <div class="category__item text-center">
                            <a href="{{ route('products.getAll', ['category' => 'Pants']) }}"
                                class="category__image d-block">
                                <div class="category-icon">
                                    <img src="/assets/images/category/pants.png" alt="icon">
                                </div>
                            </a>
                            <h4 class="mt-30"><a
                                    href="{{ route('products.getAll', ['category' => 'Pants']) }}">Pants</a></h4>
                        </div>
                    </div>
                    <div class="swiper-slide">
                        <div class="category__item text-center">
                            <a href="{{ route('products.getAll', ['category' => 'Long Pants']) }}"
                                class="category__image d-block">
                                <div class="category-icon">
                                    <img src="/assets/images/category/longpants.png" alt="icon">
                                </div>
                            </a>
                            <h4 class="mt-30"><a
                                    href="{{ route('products.getAll', ['category' => 'Long Pants']) }}">Long Pants</a>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Category area end here -->
    <!-- Product area start here -->
    <section class="product-area pt-130 pb-130">
        <div class="container">
            <div
                class="product__wrp pb-30 mb-65 bor-bottom d-flex flex-wrap align-items-center justify-content-xl-between justify-content-center">
                <div class="section-header wow fadeInUp d-flex align-items-center" data-wow-delay=".1s">
                    <span class="title-icon mr-10"></span>
                    <h2>latest arrival products</h2>
                </div>
                <ul class="nav nav-pills mt-4 mt-xl-0">
                    <li class="nav-item">
                        <a href="index-2.html#latest-item" data-bs-toggle="tab"
                            class="nav-link wow fadeInUp px-4 active" data-wow-delay=".1s">
                            latest item
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="index-2.html#top-ratting" data-bs-toggle="tab"
                            class="nav-link wow fadeInUp px-4 bor-left bor-right" data-wow-delay=".2s">
                            top ratting
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="index-2.html#featured-products" data-bs-toggle="tab"
                            class="nav-link wow fadeInUp ps-4" data-wow-delay=".3s">
                            featured products
                        </a>
                    </li>
                </ul>
            </div>
            <div class="row g-4">
                <div class="col-xl-12 col-lg-8">
                    <div class="tab-content">
                        <div id="latest-item" class="tab-pane fade show active">
                            @if (count($products) > 0)
                            <div class="row g-4">
                                @foreach ($products as $product)
                                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                                    <div class="product__item bor">
                                        <a href="{{ route('product.detail', ['id' => $product['ID']]) }}"
                                            class="product__image pt-20 d-block">
                                            @php
                                            $images = $product['ProductImages'] ?? [];
                                            $frontImage = isset($images[0]['URL'])
                                            ? config('app.back_end_base_url') .
                                            '/api' .
                                            $images[0]['URL']
                                            : asset('default-image.jpg');
                                            $backImage = isset($images[1]['URL'])
                                            ? config('app.back_end_base_url') .
                                            '/api' .
                                            $images[1]['URL']
                                            : $frontImage;
                                            @endphp

                                            <img class="font-image img-fluid" src="{{ $frontImage }}"
                                                alt="{{ $product['Name'] }}">
                                            <img class="back-image img-fluid" src="{{ $backImage }}"
                                                alt="{{ $product['Name'] }}">
                                        </a>

                                        <div class="product__content">
                                            <h4 class="mb-15">
                                                <a class="primary-hover"
                                                    href="{{ route('product.detail', ['id' => $product['ID']]) }}">
                                                    {{ Str::limit($product['Name'], 20, '...') }}
                                                </a>
                                            </h4>
                                            <del>Rp
                                                {{ number_format($product['Price'] + 20000, 0, ',', '.') }}</del>
                                            <span class="primary-color ml-10">Rp
                                                {{ number_format($product['Price'], 0, ',', '.') }}</span>
                                        </div>

                                        <a class="product__cart d-block bor-top"
                                            href="{{ route('product.detail', ['id' => $product['ID']]) }}">
                                            <i class="primary-color me-1"></i> <span>Detail Product</span>
                                        </a>
                                    </div>
                                </div>
                                @endforeach
                            </div>
                            @else
                            <div class="text-center py-5">
                                <h3>No Product Found</h3>
                                <p>Try adjusting your search or filter to find what you're looking for.</p>
                            </div>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Product area end here -->
    <!-- Service area start here -->
    <section class="service-area pt-130 pb-130">
        <div class="container">
            <div class="row g-4 align-items-center justify-content-center justify-content-lg-start">
                <div class="col-xl-3 col-lg-4 col-md-6">
                    <div class="service__item mb-50 wow fadeInUp" data-wow-delay=".1s">
                        <div class="service__icon">
                            <img src="/assets/images/icon/feature-icon1.png" alt="icon">
                        </div>
                        <div class="service__content">
                            <h4>Free delivery</h4>
                            <p>For all orders above 200K</p>
                        </div>
                    </div>
                    <div class="service__item wow fadeInUp" data-wow-delay=".2s">
                        <div class="service__icon">
                            <img src="/assets/images/icon/feature-icon2.png" alt="icon">
                        </div>
                        <div class="service__content">
                            <h4>Secure payments</h4>
                            <p>Confidence on all your devices</p>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6 col-lg-4 d-none d-lg-block wow bounceIn" data-wow-delay=".7s">
                    <div class="service__image image">
                        <img src="/assets/images/service/infinit.png" alt="image">
                        <div class="section-header service-header d-flex align-items-center">
                            <span class="title-icon mr-10"></span>
                            <h3>buy it directly at the store & save 10%</h5>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-4 col-md-6">
                    <div class="service__item mb-50 wow fadeInUp" data-wow-delay=".3s">
                        <div class="service__icon">
                            <img src="/assets/images/icon/feature-icon3.png" alt="icon">
                        </div>
                        <div class="service__content">
                            <h4>Top-notch support</h4>
                            <p>sayhello&gazacom</p>
                        </div>
                    </div>
                    <div class="service__item wow fadeInUp" data-wow-delay=".4s">
                        <div class="service__icon">
                            <img src="/assets/images/icon/feature-icon4.png" alt="icon">
                        </div>
                        <div class="service__content">
                            <h4>180 Days Return</h4>
                            <p>money back guranry</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Service area end here -->

    <script>
        const slider = document.getElementById('main-banner-slider');
        const slides = document.querySelectorAll('.main-slider-item');
        const prevBtn = document.getElementById('main-slider-prev-btn');
        const nextBtn = document.getElementById('main-slider-next-btn');
        const dotsContainer = document.getElementById('main-slider-dots');
        const dots = dotsContainer.querySelectorAll('.main-slider-dot');
        let currentIndex = 0;
        const totalSlides = slides.length;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active-dot');
                    dot.classList.add('bg-white');
                    dot.classList.remove('bg-gray-400');
                } else {
                    dot.classList.remove('active-dot');
                    dot.classList.remove('bg-white');
                    dot.classList.add('bg-gray-400');
                }
            });
        }
        var lastChangeSlide = new Date();
        function nextSlide() {
            lastChangeSlide = new Date();
            currentIndex = (currentIndex + 1) % totalSlides;
            showSlide(currentIndex);
        }

        function prevSlide() {
            lastChangeSlide = new Date();
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            showSlide(currentIndex);
        }

        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                showSlide(currentIndex);
            });
        });

        const changeInterval = 4000
        setInterval(()=> {
            var now = new Date();
            var timeDifferenceMs = now.getTime() - lastChangeSlide.getTime();
            if (timeDifferenceMs > changeInterval) {
                nextSlide()
            }
        }, changeInterval); // change every x second

        showSlide(currentIndex);
    </script>
</main>
@stop