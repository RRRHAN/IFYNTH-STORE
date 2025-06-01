@extends('layout.master')
@section('container')
    <main>
        <section class="page-banner bg-image pt-30">
            <div class="container">
                <h2 class="wow fadeInUp mb-15" data-wow-duration="1.1s" data-wow-delay=".1s">
                    @if (request('department') == 'IFY')
                        I Found You
                    @elseif (request('department') == 'NTH')
                        No Time to Hell
                    @else
                        All Products
                    @endif Catalog
                </h2>
                <div class="breadcrumb-list wow fadeInUp" data-wow-duration="1.3s" data-wow-delay=".3s">
                    <a href="/landing" class="primary-hover"><i class="fa-solid fa-house me-1"></i> Home <i
                            class="fa-regular text-white fa-angle-right"></i></a>
                    <span>
                        @if (request('department') == 'IFY')
                            I Found You
                        @elseif (request('department') == 'NTH')
                            No Time to Hell
                        @else
                            All Products
                        @endif
                    </span>
                </div>
            </div>
        </section>
        <section class="product-area pt-30 pb-130">
            <div class="container">
                <div class="pb-20 bor-bottom shop-page-wrp d-flex justify-content-between align-items-center mb-65">
                    <p class="fw-600">
                        Showing
                        {{ ($pagination['current_page'] - 1) * $pagination['perPage'] + 1 }}–{{ min($pagination['current_page'] * $pagination['perPage'], $pagination['total']) }}
                        of {{ $pagination['total'] }} results
                    </p>
                    <div class="short">
                        <select name="shortList" id="shortList">
                            <option value="0">Short by popularity</option>
                        </select>
                    </div>
                </div>
                <div class="row g-4">
                    <div class="col-xl-12 col-lg-8">
                        @if (count($products) > 0)
                            <div class="row g-4">
                                @foreach ($products as $product)
                                    <div class="col-xl-3 col-lg-3 col-md-6">
                                        <div class="product__item bor">
                                            <a href="{{ route('product.detail', ['id' => $product['ID']]) }}" class="product__image pt-20 d-block">
                                                @php
                                                    $images = $product['ProductImages'] ?? [];
                                                    $frontImage = isset($images[0]['URL'])
                                                        ? config('app.back_end_base_url').'/api' . $images[0]['URL']
                                                        : asset('default-image.jpg');
                                                    $backImage = isset($images[1]['URL'])
                                                        ? config('app.back_end_base_url').'/api' . $images[1]['URL']
                                                        : $frontImage;
                                                @endphp

                                                <img class="font-image" src="{{ $frontImage }}" alt="{{ $product['Name'] }}">
                                                <img class="back-image" src="{{ $backImage }}" alt="{{ $product['Name'] }}">
                                            </a>

                                            <div class="product__content">
                                                <h4 class="mb-15">
                                                    <a class="primary-hover" href="{{ route('product.detail', ['id' => $product['ID']]) }}">
                                                        {{ Str::limit($product['Name'], 20, '...') }}
                                                    </a>
                                                </h4>
                                                <del>Rp {{ number_format($product['Price'] + 20000, 0, ',', '.') }}</del>
                                                <span class="primary-color ml-10">Rp {{ number_format($product['Price'], 0, ',', '.') }}</span>
                                            </div>

                                            <a class="product__cart d-block bor-top" href="{{ route('product.detail', ['id' => $product['ID']]) }}">
                                                <i class="primary-color me-1"></i> <span>Detail Product</span>
                                            </a>
                                        </div>
                                    </div>
                                @endforeach
                            </div>

                            <div class="pagi-wrp mt-65">
                                @if ($pagination['total_pages'] > 1)
                                    {{-- Tombol Previous --}}
                                    @if ($pagination['current_page'] > 1)
                                        <a href="{{ url('catalog') }}?department={{ request('department') }}&page={{ $pagination['current_page'] - 1 }}"
                                            class="fa-regular ms-2 primary-hover fa-angle-left"></a>
                                    @endif

                                    {{-- Logika untuk menampilkan tautan halaman dengan elipsis --}}
                                    @php
                                        // Jumlah tautan halaman yang ingin ditampilkan di sekitar halaman saat ini (tidak termasuk awal/akhir)
                                        $linksToShow = 4; // Akan menampilkan 5 tautan (halaman saat ini + 2 kiri + 2 kanan) jika total halaman cukup

                                        $startPage = max(1, $pagination['current_page'] - floor($linksToShow / 2));
                                        $endPage = min($pagination['total_pages'], $pagination['current_page'] + floor($linksToShow / 2));

                                        // Sesuaikan rentang jika terlalu dekat dengan awal atau akhir
                                        if ($endPage - $startPage + 1 < $linksToShow) {
                                            if ($startPage === 1) {
                                                $endPage = min($pagination['total_pages'], $linksToShow);
                                            } elseif ($endPage === $pagination['total_pages']) {
                                                $startPage = max(1, $pagination['total_pages'] - $linksToShow + 1);
                                            }
                                        }
                                    @endphp

                                    {{-- Tautan ke halaman pertama (jika tidak berada di awal rentang) --}}
                                    @if ($startPage > 1)
                                        <a href="{{ url('catalog') }}?department={{ request('department') }}&page=1" class="pagi-btn">1</a>
                                        @if ($startPage > 2) {{-- Tampilkan elipsis jika ada lebih dari 1 halaman di antara 1 dan startPage --}}
                                            <span class="pagi-dots">...</span>
                                        @endif
                                    @endif

                                    {{-- Tautan halaman dalam rentang --}}
                                    @foreach (range($startPage, $endPage) as $page)
                                        <a href="{{ url('catalog') }}?department={{ request('department') }}&page={{ $page }}"
                                            class="pagi-btn {{ $pagination['current_page'] == $page ? 'active' : '' }}">
                                            {{ $page }}
                                        </a>
                                    @endforeach

                                    {{-- Tautan ke halaman terakhir (jika tidak berada di akhir rentang) --}}
                                    @if ($endPage < $pagination['total_pages'])
                                        @if ($endPage < $pagination['total_pages'] - 1) {{-- Tampilkan elipsis jika ada lebih dari 1 halaman di antara endPage dan total_pages --}}
                                            <span class="pagi-dots">...</span>
                                        @endif
                                        <a href="{{ url('catalog') }}?department={{ request('department') }}&page={{ $pagination['total_pages'] }}" class="pagi-btn">{{ $pagination['total_pages'] }}</a>
                                    @endif

                                    {{-- Tombol Next --}}
                                    @if ($pagination['current_page'] < $pagination['total_pages'])
                                        <a href="{{ url('catalog') }}?department={{ request('department') }}&page={{ $pagination['current_page'] + 1 }}"
                                            class="fa-regular ms-2 primary-hover fa-angle-right"></a>
                                    @endif
                                @endif
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
        </section>
        </main>
@stop