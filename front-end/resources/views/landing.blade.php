@extends('layout.master')
@section('container')
<main>
    <!-- Banner area start here -->
    <section class="banner-area pb-130">
        <div class="container">
            <div class="row g-4">
                <div class="col-lg-6">
                    <div class="banner__item">
                        <div class="image">
                            <img src="/assets/images/banner/banner-image1.png" alt="image">
                        </div>
                        <div class="banner__content">
                            <h1 class="wow fadeInUp" data-wow-delay=".2s">I FOUND YOU <br>
                            <span class="primary-color text-sm">product thrifting</span></h1>
                            <a class="btn-one wow fadeInUp mt-65" data-wow-delay=".3s" href="shop.html"><span>Shop
                                    Now</span></a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="banner__item">
                        <div class="image">
                            <img src="/assets/images/banner/banner-image1.png" alt="image">
                        </div>
                        <div class="banner__content">
                            <h1 class="wow fadeInUp" data-wow-delay=".2s">NO TIME TO HELL <br>
                            <span class="primary-color">our products</span></h1>
                            <a class="btn-one wow fadeInUp mt-65" data-wow-delay=".3s" href="shop.html"><span>Shop
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
                            <a href="shop.html" class="category__image d-block">
                                <img src="/assets/images/category/category-image1.png" alt="image">
                                <div class="category-icon">
                                    <img src="/assets/images/category/category-icon1.png" alt="icon">
                                </div>
                            </a>
                            <h4 class="mt-30"><a href="shop.html">best e- juice</a></h4>
                        </div>
                    </div>
                    <div class="swiper-slide">
                        <div class="category__item text-center">
                            <a href="shop.html" class="category__image d-block">
                                <img src="/assets/images/category/category-image2.png" alt="image">
                                <div class="category-icon">
                                    <img src="/assets/images/category/category-icon2.png" alt="icon">
                                </div>
                            </a>
                            <h4 class="mt-30"><a href="shop.html">best mod</a></h4>
                        </div>
                    </div>
                    <div class="swiper-slide">
                        <div class="category__item text-center">
                            <a href="shop.html" class="category__image d-block">
                                <img src="/assets/images/category/category-image3.png" alt="image">
                                <div class="category-icon">
                                    <img src="/assets/images/category/category-icon3.png" alt="icon">
                                </div>
                            </a>
                            <h4 class="mt-30"><a href="shop.html">best pan</a></h4>
                        </div>
                    </div>
                    <div class="swiper-slide">
                        <div class="category__item text-center">
                            <a href="shop.html" class="category__image d-block">
                                <img src="/assets/images/category/category-image4.png" alt="image">
                                <div class="category-icon">
                                    <img src="/assets/images/category/category-icon4.png" alt="icon">
                                </div>
                            </a>
                            <h4 class="mt-30"><a href="shop.html">best pod</a></h4>
                        </div>
                    </div>
                    <div class="swiper-slide">
                        <div class="category__item text-center">
                            <a href="shop.html" class="category__image d-block">
                                <img src="/assets/images/category/category-image5.png" alt="image">
                                <div class="category-icon">
                                    <img src="/assets/images/category/category-icon5.png" alt="icon">
                                </div>
                            </a>
                            <h4 class="mt-30"><a href="shop.html">best tank</a></h4>
                        </div>
                    </div>
                    <div class="swiper-slide">
                        <div class="category__item text-center">
                            <a href="shop.html" class="category__image d-block">
                                <img src="/assets/images/category/category-image6.png" alt="image">
                                <div class="category-icon">
                                    <img src="/assets/images/category/category-icon6.png" alt="icon">
                                </div>
                            </a>
                            <h4 class="mt-30"><a href="shop.html">Best vaps</a></h4>
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
                        <a href="index-2.html#featured-products" data-bs-toggle="tab" class="nav-link wow fadeInUp ps-4"
                            data-wow-delay=".3s">
                            featured products
                        </a>
                    </li>
                </ul>
            </div>
            <div class="row g-4">
                <div class="col-xl-12 col-lg-8">
                    <div class="tab-content">
                        <div id="latest-item" class="tab-pane fade show active">
                            <div class="row g-4">
                                <div class="col-xl-3 col-lg-3 col-md-6">
                                    <div class="product__item bor">
                                        <a href="index-2.html#0" class="wishlist"><i
                                                class="fa-regular fa-heart"></i></a>
                                        <a href="shop-single.html" class="product__image pt-20 d-block">
                                            <img class="font-image" src="{{ Vite::asset('resources/images/product/product-image1.png') }}"
                                                alt="image">
                                            <img class="back-image" src="{{ Vite::asset('resources/images/product/product-image3.png') }}"
                                                alt="image">
                                        </a>
                                        <div class="product__content">
                                            <h4 class="mb-15"><a class="primary-hover" href="shop-single.html">Menthol
                                                    E-Cigarette Kit</a></h4>
                                            <del>$74.50</del><span class="primary-color ml-10">$49.50</span>
                                            <div class="star mt-20">
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                            </div>

                                        </div>
                                        <a class="product__cart d-block bor-top" href="index-2.html#0"><i
                                                class="fa-regular fa-cart-shopping primary-color me-1"></i>
                                            <span>Add to
                                                cart</span></a>
                                    </div>
                                </div>
                                <div class="col-xl-3 col-lg-3 col-md-6">
                                    <div class="product__item bor">
                                        <a href="index-2.html#0" class="wishlist"><i
                                                class="fa-regular fa-heart"></i></a>
                                        <a href="shop-single.html" class="product__image pt-20 d-block">
                                            <img class="font-image" src="/assets/images/product/product-image2.png"
                                                alt="image">
                                            <img class="back-image" src="/assets/images/product/product-image4.png"
                                                alt="image">
                                        </a>
                                        <div class="product__content">
                                            <h4 class="mb-15"><a class="primary-hover"
                                                    href="shop-single.html">Disposable
                                                    Sub-Ohm Tank</a></h4>
                                            <del>$74.50</del><span class="primary-color ml-10">$49.50</span>
                                            <div class="star mt-20">
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                            </div>

                                        </div>
                                        <a class="product__cart d-block bor-top" href="index-2.html#0"><i
                                                class="fa-regular fa-cart-shopping primary-color me-1"></i>
                                            <span>Add to
                                                cart</span></a>
                                    </div>
                                </div>
                                <div class="col-xl-3 col-lg-3 col-md-6">
                                    <div class="product__item bor">
                                        <a href="index-2.html#0" class="wishlist"><i
                                                class="fa-regular fa-heart"></i></a>
                                        <a href="shop-single.html" class="product__image pt-20 d-block">
                                            <img class="font-image" src="/assets/images/product/product-image3.png"
                                                alt="image">
                                            <img class="back-image" src="/assets/images/product/product-image5.png"
                                                alt="image">
                                        </a>
                                        <div class="product__content">
                                            <h4 class="mb-15"><a class="primary-hover" href="shop-single.html">POP
                                                    Extra
                                                    Strawberry</a></h4>
                                            <del>$74.50</del><span class="primary-color ml-10">$49.50</span>
                                            <div class="star mt-20">
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                            </div>

                                        </div>
                                        <a class="product__cart d-block bor-top" href="index-2.html#0"><i
                                                class="fa-regular fa-cart-shopping primary-color me-1"></i>
                                            <span>Add to
                                                cart</span></a>
                                    </div>
                                </div>
                                <div class="col-xl-3 col-lg-3 col-md-6">
                                    <div class="product__item bor">
                                        <a href="index-2.html#0" class="wishlist"><i
                                                class="fa-regular fa-heart"></i></a>
                                        <a href="shop-single.html" class="product__image pt-20 d-block">
                                            <img class="font-image" src="/assets/images/product/product-image4.png"
                                                alt="image">
                                            <img class="back-image" src="/assets/images/product/product-image6.png"
                                                alt="image">
                                        </a>
                                        <div class="product__content">
                                            <h4 class="mb-15"><a class="primary-hover" href="shop-single.html">Battery
                                                    And
                                                    Charger Kit</a></h4>
                                            <del>$74.50</del><span class="primary-color ml-10">$49.50</span>
                                            <div class="star mt-20">
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                            </div>

                                        </div>
                                        <a class="product__cart d-block bor-top" href="index-2.html#0"><i
                                                class="fa-regular fa-cart-shopping primary-color me-1"></i>
                                            <span>Add to
                                                cart</span></a>
                                    </div>
                                </div>
                                <div class="col-xl-3 col-lg-3 col-md-6">
                                    <div class="product__item bor">
                                        <a href="index-2.html#0" class="wishlist"><i
                                                class="fa-regular fa-heart"></i></a>
                                        <a href="shop-single.html" class="product__image pt-20 d-block">
                                            <img class="font-image" src="/assets/images/product/product-image5.png"
                                                alt="image">
                                            <img class="back-image" src="/assets/images/product/product-image3.png"
                                                alt="image">
                                        </a>
                                        <div class="product__content">
                                            <h4 class="mb-15"><a class="primary-hover" href="shop-single.html">Pods
                                                    Sold
                                                    Separately</a></h4>
                                            <del>$74.50</del><span class="primary-color ml-10">$49.50</span>
                                            <div class="star mt-20">
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                            </div>

                                        </div>
                                        <a class="product__cart d-block bor-top" href="index-2.html#0"><i
                                                class="fa-regular fa-cart-shopping primary-color me-1"></i>
                                            <span>Add to
                                                cart</span></a>
                                    </div>
                                </div>
                                <div class="col-xl-3 col-lg-3 col-md-6">
                                    <div class="product__item bor">
                                        <a href="index-2.html#0" class="wishlist"><i
                                                class="fa-regular fa-heart"></i></a>
                                        <a href="shop-single.html" class="product__image pt-20 d-block">
                                            <img class="font-image" src="/assets/images/product/product-image6.png"
                                                alt="image">
                                            <img class="back-image" src="/assets/images/product/product-image4.png"
                                                alt="image">
                                        </a>
                                        <div class="product__content">
                                            <h4 class="mb-15"><a class="primary-hover" href="shop-single.html">100ml
                                                    Nic
                                                    Salt Juice</a></h4>
                                            <del>$74.50</del><span class="primary-color ml-10">$49.50</span>
                                            <div class="star mt-20">
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                            </div>

                                        </div>
                                        <a class="product__cart d-block bor-top" href="index-2.html#0"><i
                                                class="fa-regular fa-cart-shopping primary-color me-1"></i>
                                            <span>Add to
                                                cart</span></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="top-ratting" class="tab-pane fade">
                            <div class="row g-4">
                                <div class="col-xl-3 col-lg-3 col-md-6">
                                    <div class="product__item bor">
                                        <a href="index-2.html#0" class="wishlist"><i
                                                class="fa-regular fa-heart"></i></a>
                                        <a href="shop-single.html" class="product__image pt-20 d-block">
                                            <img class="font-image" src="/assets/images/product/product-image5.png"
                                                alt="image">
                                            <img class="back-image" src="/assets/images/product/product-image3.png"
                                                alt="image">
                                        </a>
                                        <div class="product__content">
                                            <h4 class="mb-15"><a class="primary-hover" href="shop-single.html">Pods
                                                    Sold
                                                    Separately</a></h4>
                                            <del>$74.50</del><span class="primary-color ml-10">$49.50</span>
                                            <div class="star mt-20">
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                            </div>

                                        </div>
                                        <a class="product__cart d-block bor-top" href="index-2.html#0"><i
                                                class="fa-regular fa-cart-shopping primary-color me-1"></i>
                                            <span>Add to
                                                cart</span></a>
                                    </div>
                                </div>
                                <div class="col-xl-3 col-lg-3 col-md-6">
                                    <div class="product__item bor">
                                        <a href="index-2.html#0" class="wishlist"><i
                                                class="fa-regular fa-heart"></i></a>
                                        <a href="shop-single.html" class="product__image pt-20 d-block">
                                            <img class="font-image" src="/assets/images/product/product-image6.png"
                                                alt="image">
                                            <img class="back-image" src="/assets/images/product/product-image4.png"
                                                alt="image">
                                        </a>
                                        <div class="product__content">
                                            <h4 class="mb-15"><a class="primary-hover" href="shop-single.html">100ml
                                                    Nic
                                                    Salt Juice</a></h4>
                                            <del>$74.50</del><span class="primary-color ml-10">$49.50</span>
                                            <div class="star mt-20">
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                            </div>

                                        </div>
                                        <a class="product__cart d-block bor-top" href="index-2.html#0"><i
                                                class="fa-regular fa-cart-shopping primary-color me-1"></i>
                                            <span>Add to
                                                cart</span></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="featured-products" class="tab-pane fade">
                            <div class="row g-4">
                                <div class="col-xl-3 col-lg-3 col-md-6">
                                    <div class="product__item bor">
                                        <a href="index-2.html#0" class="wishlist"><i
                                                class="fa-regular fa-heart"></i></a>
                                        <a href="shop-single.html" class="product__image pt-20 d-block">
                                            <img class="font-image" src="/assets/images/product/product-image4.png"
                                                alt="image">
                                            <img class="back-image" src="/assets/images/product/product-image6.png"
                                                alt="image">
                                        </a>
                                        <div class="product__content">
                                            <h4 class="mb-15"><a class="primary-hover" href="shop-single.html">Battery
                                                    And
                                                    Charger Kit</a></h4>
                                            <del>$74.50</del><span class="primary-color ml-10">$49.50</span>
                                            <div class="star mt-20">
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                            </div>

                                        </div>
                                        <a class="product__cart d-block bor-top" href="index-2.html#0"><i
                                                class="fa-regular fa-cart-shopping primary-color me-1"></i>
                                            <span>Add to
                                                cart</span></a>
                                    </div>
                                </div>
                                <div class="col-xl-3 col-lg-3 col-md-6">
                                    <div class="product__item bor">
                                        <a href="index-2.html#0" class="wishlist"><i
                                                class="fa-regular fa-heart"></i></a>
                                        <a href="shop-single.html" class="product__image pt-20 d-block">
                                            <img class="font-image" src="/assets/images/product/product-image5.png"
                                                alt="image">
                                            <img class="back-image" src="/assets/images/product/product-image3.png"
                                                alt="image">
                                        </a>
                                        <div class="product__content">
                                            <h4 class="mb-15"><a class="primary-hover" href="shop-single.html">Pods
                                                    Sold
                                                    Separately</a></h4>
                                            <del>$74.50</del><span class="primary-color ml-10">$49.50</span>
                                            <div class="star mt-20">
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                            </div>

                                        </div>
                                        <a class="product__cart d-block bor-top" href="index-2.html#0"><i
                                                class="fa-regular fa-cart-shopping primary-color me-1"></i>
                                            <span>Add to
                                                cart</span></a>
                                    </div>
                                </div>
                                <div class="col-xl-3 col-lg-3 col-md-6">
                                    <div class="product__item bor">
                                        <a href="index-2.html#0" class="wishlist"><i
                                                class="fa-regular fa-heart"></i></a>
                                        <a href="shop-single.html" class="product__image pt-20 d-block">
                                            <img class="font-image" src="/assets/images/product/product-image6.png"
                                                alt="image">
                                            <img class="back-image" src="/assets/images/product/product-image4.png"
                                                alt="image">
                                        </a>
                                        <div class="product__content">
                                            <h4 class="mb-15"><a class="primary-hover" href="shop-single.html">100ml
                                                    Nic
                                                    Salt Juice</a></h4>
                                            <del>$74.50</del><span class="primary-color ml-10">$49.50</span>
                                            <div class="star mt-20">
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                            </div>

                                        </div>
                                        <a class="product__cart d-block bor-top" href="index-2.html#0"><i
                                                class="fa-regular fa-cart-shopping primary-color me-1"></i>
                                            <span>Add to
                                                cart</span></a>
                                    </div>
                                </div>
                            </div>
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
                            <p>For all orders above $45</p>
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
                        <img src="/assets/images/service/service-image.png" alt="image">
                        <div class="section-header service-header d-flex align-items-center">
                            <span class="title-icon mr-10"></span>
                            <h2>sign up & save 25%</h2>
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
</main>
 @stop