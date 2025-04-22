@extends('layout.master')
@section('container')
<main>
    <!-- Page banner area start here -->
    <section class="page-banner bg-image"></section>

    <!-- cart page area start here -->
    <section class="cart-page pt-30 pb-130">
        <div class="container">
            @if(count($cartItems) > 0)
            <!-- Shopping Cart - Desktop -->
            <div class="shopping-cart radius-10 bor sub-bg">
                <div class="column-labels py-3 px-4 d-flex justify-content-between align-items-center fw-bold text-white text-uppercase">
                    <label class="product-details">Product</label>
                    <label class="product-price">Price</label>
                    <label class="product-quantity">Quantity</label>
                    <label class="product-line-price">Total</label>
                    <label class="product-removal">Edit</label>
                </div>

                @foreach($cartItems as $item)
                <div class="product p-4 bor-top bor-bottom d-flex justify-content-between align-items-center">
                    <div class="product-details d-flex align-items-center">
                        <img src="{{ asset($item['image']) }}" alt="image">
                        <h4 class="ps-4 text-capitalize">{{ $item['name'] }} ({{ $item['size'] }})</h4>
                    </div>
                    <div class="product-price">Rp.{{ number_format($item['price'], 2) }}</div>
                    <div class="product-quantity">
                        <input type="number" value="{{ $item['quantity'] }}" min="1" readonly>
                    </div>
                    <div class="product-line-price">Rp.{{ number_format($item['price'] * $item['quantity'], 2) }}</div>
                    <div class="product-removal">
                        <form action="{{ route('cart.remove', $item['product_id']) }}" method="POST">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="remove-product">
                                <i class="fa-solid fa-x heading-color"></i>
                            </button>
                        </form>
                    </div>
                </div>
                @endforeach
                <div class="totals">
                    <div class="totals-item theme-color float-end mt-3">
                        <span class="fw-bold text-uppercase py-2">Cart total =</span>
                        <div class="totals-value d-inline py-2 pe-2">Rp.{{ number_format(collect($cartItems)->sum(fn($item) => $item['price'] * $item['quantity']), 2) }}</div>
                        <a href="#" class="btn-one py-2 px-4" data-bs-toggle="modal" data-bs-target="#shippingModal">
                            <span>Checkout</span>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Shopping Cart - Mobile -->
            <div class="shopping-cart mobile-view bor sub-bg">
                @foreach($cartItems as $item)
                <div class="product p-4 bor-bottom">
                    <div class="product-details d-flex align-items-center">
                        <img src="{{ asset($item['image']) }}" alt="image">
                        <h4 class="ps-4 text-capitalize">{{ $item['name'] }} ({{ $item['size'] }})</h4>
                    </div>
                    <div class="product-price">Rp.{{ number_format($item['price'], 2) }}</div>
                    <div class="product-quantity">
                        <input type="number" value="{{ $item['quantity'] }}" min="1" readonly>
                    </div>
                    <div class="product-line-price">Rp.{{ number_format($item['price'] * $item['quantity'], 2) }}</div>
                    <div class="product-removal">
                        <form action="{{ route('cart.remove', $item['product_id']) }}" method="POST">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="remove-product">
                                <i class="fa-solid fa-x heading-color"></i>
                            </button>
                        </form>
                    </div>
                </div>
                @endforeach
                <div class="totals">
                    <div class="totals-item theme-color float-end mt-3">
                        <span class="fw-bold text-uppercase py-2">Cart total =</span>
                        <div class="totals-value d-inline py-2 pe-2">Rp.{{ number_format(collect($cartItems)->sum(fn($item) => $item['price'] * $item['quantity']), 2) }}</div>
                        <a href="/checkout" class="btn-one py-2 px-4"><span>Checkout</span></a>
                    </div>
                </div>
            </div>

            @else
            <p class="text-center text-white">Your cart is empty.</p>
            @endif
        </div>
    </section>
    <!-- cart page area end here -->
</main>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        const provinces = {
            "Aceh": ["Banda Aceh", "Lhokseumawe", "Langsa", "Meulaboh"],
            "Bali": ["Denpasar", "Gianyar", "Tabanan"],
            "Banten": ["Serang", "Tangerang", "Cilegon", "Lebak"],
            "Bengkulu": ["Bengkulu", "Mukomuko"],
            "DI Yogyakarta": ["Yogyakarta", "Bantul", "Gunungkidul"],
            "DKI Jakarta": ["Jakarta Pusat", "Jakarta Selatan", "Jakarta Barat"],
            "Gorontalo": ["Gorontalo", "Limboto"],
            "Jambi": ["Jambi", "Muaro Jambi"],
            "Jawa Barat": ["Bandung", "Bekasi", "Bogor", "Depok"],
            "Jawa Tengah": ["Semarang", "Solo", "Tegal", "Magelang"],
            "Jawa Timur": ["Surabaya", "Malang", "Kediri", "Sidoarjo"],
            "Kalimantan Barat": ["Pontianak", "Singkawang"],
            "Kalimantan Selatan": ["Banjarmasin", "Banjarbaru"],
            "Kalimantan Tengah": ["Palangka Raya", "Sampit"],
            "Kalimantan Timur": ["Samarinda", "Balikpapan"],
            "Kalimantan Utara": ["Tanjung Selor"],
            "Kepulauan Bangka Belitung": ["Pangkal Pinang"],
            "Kepulauan Riau": ["Tanjung Pinang", "Batam"],
            "Lampung": ["Bandar Lampung", "Metro"],
            "Maluku": ["Ambon", "Tual"],
            "Maluku Utara": ["Ternate", "Tidore"],
            "Nusa Tenggara Barat": ["Mataram", "Bima"],
            "Nusa Tenggara Timur": ["Kupang", "Ende"],
            "Papua": ["Jayapura", "Biak"],
            "Papua Barat": ["Manokwari", "Sorong"],
            "Riau": ["Pekanbaru", "Dumai"],
            "Sulawesi Barat": ["Mamuju"],
            "Sulawesi Selatan": ["Makassar", "Parepare"],
            "Sulawesi Tengah": ["Palu", "Poso"],
            "Sulawesi Tenggara": ["Kendari", "Baubau"],
            "Sulawesi Utara": ["Manado", "Bitung"],
            "Sumatera Barat": ["Padang", "Bukittinggi"],
            "Sumatera Selatan": ["Palembang", "Lubuk Linggau"],
            "Sumatera Utara": ["Medan", "Binjai"]
        };

        const provinceSelect = document.getElementById("province");
        const citySelect = document.getElementById("city");

        // Populate province dropdown
        Object.keys(provinces).forEach(province => {
            let option = document.createElement("option");
            option.value = province;
            option.textContent = province;
            provinceSelect.appendChild(option);
        });

        // Handle province change
        provinceSelect.addEventListener("change", function () {
            let selectedProvince = this.value;
            citySelect.innerHTML = '<option value="">Select City</option>'; // Reset city options

            if (selectedProvince && provinces[selectedProvince]) {
                provinces[selectedProvince].forEach(city => {
                    let option = document.createElement("option");
                    option.value = city;
                    option.textContent = city;
                    citySelect.appendChild(option);
                });
            }
        });
    });
</script>


@stop