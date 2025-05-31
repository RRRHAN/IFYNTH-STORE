@extends('layout.master')
@section('container')
    <main>
        <!-- Page banner area start here -->
        <section class="page-banner bg-image">
        </section>
        <!-- Page banner area end here -->
        <div class="user-profile">
            <div class="container py-5">
                <div class="row">
                    <!-- Profile Header -->
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

                    <!-- Main Content -->
                    <div class="col-12">
                        <div class="card border-0 shadow-sm">
                            <div class="card-body p-0">
                                <div class="row g-0">
                                    <!-- Sidebar -->
                                    <div class="col-lg-3 border-end">
                                        <div class="p-4">
                                            <div class="nav flex-column dash-pills" id="settings-tabs" role="tablist">
                                                <a class="dash-link active" id="personal-tab" data-bs-toggle="pill"
                                                    href="#personal" role="tab">
                                                    <i class="fas fa-user me-2"></i> Personal Info
                                                </a>
                                                <a class="dash-link" id="security-tab" data-bs-toggle="pill"
                                                    href="#security" role="tab">
                                                    <i class="fas fa-lock me-2"></i> Security
                                                </a>
                                                <a class="dash-link" id="my-order-tab" data-bs-toggle="pill"
                                                    href="#my-order" role="tab">
                                                    <i class="fas fa-box me-2"></i> my order
                                                </a>
                                                <a class="dash-link" id="my-offer-tab" data-bs-toggle="pill"
                                                    href="#my-offer" role="tab">
                                                    <i class="fas fa-box me-2"></i> my offer
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

                                    <!-- Content Area -->
                                    <div class="col-lg-9">
                                        <div class="p-4">
                                            <div class="tab-content" id="settings-content">
                                                @include('components.personal')
                                                @include('components.changePassword')
                                                @include('components.notifications')
                                                @include('components.orderData')
                                                @include('components.tableOffer')
                                                @include('components.detailOfferModal')
                                            </div>
                                        </div>
                                    </div>
                                    <!-- End Content Area -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <script>
    const products = @json($products);
    const user = @json($user);
    const transactions = @json($transactions);

    console.log("Products:", products);
    console.log("User:", user);
    console.log("Transactions:", transactions);
</script>

@stop
