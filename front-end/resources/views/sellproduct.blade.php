@extends('layout.master')
@section('container')
    <main>
        <!-- Page banner area start here -->
        <section class="page-banner bg-image pt-30" data-background="assets/images/banner/inner-banner.jpg">
            <div class="container">
                <h2 class="wow fadeInUp mb-15" data-wow-duration="1.1s" data-wow-delay=".1s">Sell Your Clothes</h2>
                <div class="breadcrumb-list wow fadeInUp" data-wow-duration="1.3s" data-wow-delay=".3s">
                    <a href="/landing" class="primary-hover"><i class="fa-solid fa-house me-1"></i> Home <i
                            class="fa-regular text-white fa-angle-right"></i></a>
                    <span>Sell Your Clothes</span>
                </div>
            </div>
        </section>
        <!-- Page banner area end here -->

        <!-- Product form area start here -->
        <section class="product-area pt-30 pb-130">
            <div class="container">
                <div class="pb-20 bor-bottom shop-page-wrp d-flex justify-content-between align-items-center mb-65">
                    <p class="fw-600">Add a New Product</p>
                </div>
                <div class="row g-4">
                    <div class="col-xl-12 col-lg-8">
                        <form action="{{ route('offer.product') }}" method="POST" enctype="multipart/form-data">
                            @csrf
                            <div class="container">
                                <div class="row justify-content-center">
                                    <!-- Nama Produk -->
                                    <div class="col-md-8 mt-2">
                                        <div class="form-group">
                                            <label for="productName">Nama Produk</label>
                                            <input type="text" id="productName" name="name" class="form-control"
                                                required>
                                        </div>
                                    </div>

                                    <!-- Harga Produk -->
                                    <div class="col-md-8 mt-2">
                                        <div class="form-group">
                                            <label for="productPrice">Harga Produk</label>
                                            <input type="number" id="productPrice" name="price"
                                                class="form-control" required>
                                        </div>
                                    </div>

                                    <!-- Foto/Video Produk -->
                                    <div class="col-md-8 mt-2">
                                        <div class="form-group">
                                            <label for="productMedia">Foto / Video Produk (Upload lebih dari satu
                                                file)</label>
                                            <input type="file" id="productMedia" name="files[]"
                                                class="form-control" multiple required>
                                        </div>
                                    </div>

                                    <!-- Deskripsi Produk -->
                                    <div class="col-md-8 mt-2">
                                        <div class="form-group">
                                            <label for="productDescription">Deskripsi Produk</label>
                                            <textarea id="productDescription" name="description" class="form-control" rows="4" required></textarea>
                                        </div>
                                    </div>

                                    <!-- Submit Button -->
                                    <div class="col-md-8">
                                        <button type="submit" class="btn-one mt-5"><span>Offer Product</span></button>
                                    </div>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </section>
        <!-- Product form area end here -->
    </main>
@stop
