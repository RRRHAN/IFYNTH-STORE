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
                                    <img src="https://randomuser.me/api/portraits/men/40.jpg"
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
                                                <a class="dash-link" id="notifications-tab" data-bs-toggle="pill"
                                                    href="#notifications" role="tab">
                                                    <i class="fas fa-bell me-2"></i> Notifications
                                                </a>
                                                <a class="dash-link" id="message-tab" data-bs-toggle="pill" href="#message"
                                                    role="tab">
                                                    <i class="fas fa-messages me-2"></i> Message
                                                </a>
                                                <a class="dash-link" id="my-order-tab" data-bs-toggle="pill"
                                                    href="#my-order" role="tab">
                                                    <i class="fas fa-box me-2"></i> my order
                                                </a>
                                                <form id="logout-btn" class="d-inline">
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
                                                <!-- Personal Information -->
                                                <div class="tab-pane fade show active" id="personal" role="tabpanel">
                                                    <h5 class="mb-4">Personal Information</h5>
                                                    <div class="row g-3">
                                                        <div class="col-md-6">
                                                            <label class="form-label">Username</label>
                                                            <input type="text" class="form-control"
                                                                value="{{ session('user_name', 'Enter your Username') }}">
                                                        </div>
                                                        <div class="col-md-6">
                                                            <label class="form-label">Phone</label>
                                                            <input type="tel" class="form-control"
                                                                value="{{ session('user_phone', 'Enter your Phone Number') }}">
                                                        </div>
                                                        <div class="col-md-6">
                                                            <label class="form-label">First Name</label>
                                                            <input type="text" class="form-control"
                                                                value="{{ session('user_firstname', 'Enter your First Name') }}">
                                                        </div>
                                                        <div class="col-md-6">
                                                            <label class="form-label">Last Name</label>
                                                            <input type="text" class="form-control"
                                                                value="{{ session('user_lastname', 'Enter your Last Name') }}">
                                                        </div>
                                                        <div class="col-md-12">
                                                            <label class="form-label">Email</label>
                                                            <input type="email" class="form-control"
                                                                value="{{ session('user_email', 'Enter your Email') }}">
                                                        </div>
                                                        <div class="col-12">
                                                            <label class="form-label">Bio</label>
                                                            <textarea class="form-control" rows="4">Product designer with 5+ years of experience in creating user-centered digital solutions. Passionate about solving complex problems through simple and elegant designs.</textarea>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Security -->
                                                <div class="tab-pane fade" id="security" role="tabpanel">
                                                    <h5 class="mb-4">Security Settings</h5>
                                                    <form>
                                                        <div class="mb-3">
                                                            <label class="form-label">Current Password</label>
                                                            <input type="password" class="form-control"
                                                                placeholder="Enter current password">
                                                        </div>
                                                        <div class="mb-3">
                                                            <label class="form-label">New Password</label>
                                                            <input type="password" class="form-control"
                                                                placeholder="Enter new password">
                                                        </div>
                                                        <div class="mb-3">
                                                            <label class="form-label">Confirm New Password</label>
                                                            <input type="password" class="form-control"
                                                                placeholder="Confirm new password">
                                                        </div>
                                                        <button type="submit" class="btn btn-primary">Save
                                                            Changes</button>
                                                    </form>
                                                </div>

                                                <!-- Notifications -->
                                                <div class="tab-pane fade" id="notifications" role="tabpanel">
                                                    <h5 class="mb-4">Notifications</h5>
                                                    <p>Notification settings content goes here...</p>
                                                </div>

                                                <!-- message -->
                                                <div class="tab-pane fade" id="message" role="tabpanel">
                                                    <h5 class="mb-4">Message</h5>
                                                    <p>message settings content goes here...</p>
                                                </div>

                                                <!-- my-order -->
                                                <div class="tab-pane fade" id="my-order" role="tabpanel">
                                                    <h5 class="mb-4">Recent my-order</h5>
                                                    <div class="my-order-item mb-3">
                                                        <h6 class="mb-1">Updated profile picture</h6>
                                                        <p class="text-muted small mb-0">2 hours ago</p>
                                                    </div>
                                                    <div class="my-order-item mb-3">
                                                        <h6 class="mb-1">Changed password</h6>
                                                        <p class="text-muted small mb-0">Yesterday</p>
                                                    </div>
                                                    <div class="my-order-item">
                                                        <h6 class="mb-1">Updated message information</h6>
                                                        <p class="text-muted small mb-0">3 days ago</p>
                                                    </div>
                                                </div>
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
@stop
