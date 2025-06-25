@extends('layout.master')
@section('container')
    <main>
        <section class="page-banner bg-image">
        </section>
        <div class="user-profile">
            <div class="container py-5">
                <div class="row">
                    <div class="col-12">
                        <div class="profile-header position-relative mt-5">
                            <div class="text-center">
                                <div class="position-relative d-inline-block">
                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                        class="rounded-circle profile-pic" alt="Profile Picture">
                                    <button class="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle">
                                        <i class="fas fa-camera"></i>
                                    </button>
                                </div>
                                <h3 class="mt-3 mb-1">{{ session('username') }}</h3>
                                <p class="mb-3">Customer</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="card border-0 shadow-sm">
                            <div class="card-body p-0">
                                <div class="row g-0">
                                    <div class="col-lg-3 border-end">
                                        <div class="p-4">
                                            <div class="nav flex-column dash-pills" id="settings-tabs" role="tablist">
                                                <a class="dash-link active" id="personal-tab" data-bs-toggle="pill"
                                                    href="#personal" role="tab" aria-controls="personal"
                                                    aria-selected="true">
                                                    <i class="fas fa-user me-2"></i> Personal Info
                                                </a>
                                                <a class="dash-link" id="address-tab" data-bs-toggle="pill" href="#address"
                                                    role="tab" aria-controls="address" aria-selected="false">
                                                    <i class="fa-solid fa-map-location-dot"></i> Address
                                                </a>
                                                <a class="dash-link" id="security-tab" data-bs-toggle="pill"
                                                    href="#security" role="tab" aria-controls="security"
                                                    aria-selected="false">
                                                    <i class="fas fa-lock me-2"></i> Security
                                                </a>
                                                <a class="dash-link" id="my-order-tab" data-bs-toggle="pill"
                                                    href="#my-order" role="tab" aria-controls="my-order"
                                                    aria-selected="false">
                                                    <i class="fas fa-box me-2"></i> My Order
                                                </a>
                                                <a class="dash-link" id="my-offer-tab" data-bs-toggle="pill"
                                                    href="#my-offer" role="tab" aria-controls="my-offer"
                                                    aria-selected="false">
                                                    <i class="fas fa-box me-2"></i> My Offer
                                                </a>
                                                <form action="{{ route('logout') }}" method="POST" class="d-inline">
                                                    @csrf
                                                    <button type="submit" class="dash-link border-0 bg-transparent">
                                                        <i class="fas fa-right-from-bracket me-2"></i> Logout
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-lg-9">
                                        <div class="p-4">
                                            <div class="tab-content" id="settings-content">
                                                <div class="tab-pane fade show active" id="personal" role="tabpanel"
                                                    aria-labelledby="personal-tab">
                                                    @include('components.personal')
                                                </div>
                                                <div class="tab-pane fade" id="address" role="tabpanel"
                                                    aria-labelledby="address-tab">
                                                    @include('components.address')
                                                </div>
                                                <div class="tab-pane fade" id="security" role="tabpanel"
                                                    aria-labelledby="security-tab">
                                                    @include('components.changePassword')
                                                </div>
                                                <div class="tab-pane fade" id="my-order" role="tabpanel"
                                                    aria-labelledby="my-order-tab">
                                                    @include('components.orderData')
                                                </div>
                                                <div class="tab-pane fade" id="my-offer" role="tabpanel"
                                                    aria-labelledby="my-offer-tab">
                                                    @include('components.tableOffer')
                                                </div>
                                                {{-- Ini mungkin modal, jadi tidak perlu tab-pane --}}
                                                @include('components.detailOfferModal')
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </main>

    <script>
        // Data dari Laravel
        const products = @json($products);
        const user = @json($user);
        const transactions = @json($transactions);

        console.log("Products:", products);
        console.log("User:", user);
        console.log("Transactions:", transactions);

        // --- JavaScript untuk mempertahankan tab aktif ---
        document.addEventListener('DOMContentLoaded', function() {
            const settingsTabsContainer = document.getElementById('settings-tabs');
            // Pastikan tab default yang aktif jika tidak ada yang tersimpan
            const defaultTabId = 'personal-tab';
            const defaultPaneId = 'personal';

            // Fungsi untuk mengaktifkan tab dan kontennya
            function activateTabAndPane(tabId) {
                const tabElement = document.getElementById(tabId);
                if (tabElement) {
                    // Hapus kelas 'active' dari semua link tab
                    document.querySelectorAll('.dash-link').forEach(link => {
                        link.classList.remove('active');
                        link.setAttribute('aria-selected', 'false');
                    });

                    // Hapus kelas 'show' dan 'active' dari semua konten tab
                    document.querySelectorAll('.tab-pane').forEach(pane => {
                        pane.classList.remove('show', 'active');
                    });

                    // Tambahkan kelas 'active' ke link tab yang diklik/dipilih
                    tabElement.classList.add('active');
                    tabElement.setAttribute('aria-selected', 'true');

                    // Dapatkan ID konten tab dari atribut href
                    const targetPaneId = tabElement.getAttribute('href').substring(1);
                    const targetPane = document.getElementById(targetPaneId);

                    // Tambahkan kelas 'show' dan 'active' ke konten tab yang sesuai
                    if (targetPane) {
                        targetPane.classList.add('show', 'active');
                    }
                }
            }

            // Event listener untuk saat tab diklik
            if (settingsTabsContainer) {
                settingsTabsContainer.addEventListener('click', function(e) {
                    const clickedLink = e.target.closest('.dash-link');
                    // Pastikan yang diklik adalah link tab yang memiliki data-bs-toggle="pill"
                    if (clickedLink && clickedLink.getAttribute('data-bs-toggle') === 'pill') {
                        const tabId = clickedLink.id;
                        localStorage.setItem('activeTabId', tabId); // Simpan ID tab ke localStorage
                    }
                });
            }


            // Saat halaman dimuat, aktifkan tab yang terakhir disimpan
            const storedTabId = localStorage.getItem('activeTabId');

            if (storedTabId) {
                activateTabAndPane(storedTabId);
            } else {
                // Jika tidak ada tab yang disimpan, aktifkan tab default
                activateTabAndPane(defaultTabId);
            }
        });
    </script>

@stop
