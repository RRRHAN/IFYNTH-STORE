@extends('layout.master')

@section('container')
    <main>
        <!-- Page banner area start here -->
        <section class="page-banner bg-image">
        </section>
        <!-- Page banner area end here -->

        <!-- Register area start here -->
        <section class="login-area pt-30 pb-130">
            <div class="container">
                <div class="login__item">
                    <div class="row g-4">
                        <div class="col-xxl-8">
                            <div class="login__image">
                                <img src="assets/images/register/model2.jpeg" alt="image">
                                <div class="btn-wrp">
                                    <a href="/login">sign in</a>
                                    <a class="active" href="/register">create account</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-xxl-4">
                            <div class="login__content">
                                <h2 class="text-white mb-65">create account</h2>
                                <div class="form-area login__form">
                                    <!-- Use standard form submission -->
                                    <form id="register-form">
                                        @csrf
                                        <input type="text" id="name" name="name" placeholder="Full Name"
                                            required>
                                        <input class="mt-30" type="text" id="username" name="username"
                                            placeholder="Username" required>
                                        <input class="mt-30" type="number" id="phoneNumber" name="phoneNumber"
                                            placeholder="Phone Number" required>
                                        <input class="mt-30" type="password" id="password" name="password"
                                            placeholder="Enter Password" required>
                                        <input class="mt-30" type="password" id="password_confirmation"
                                            name="password_confirmation" placeholder="Enter Confirm Password" required>
                                        <div class="radio-btn mt-30">
                                            <span></span>
                                            <p>I accept your terms & conditions</p>
                                        </div>
                                        <button class="mt-30" type="submit">Create Account</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </section>
        <!-- Register area end here -->
    </main>

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
        const registerUrl = "{{ route('user.register') }}";
    
        document.getElementById('register-form').addEventListener('submit', function(e) {
            e.preventDefault();
    
            const formData = new FormData(this);
    
            // Kirim data ke Laravel route
            axios.post(registerUrl, {
                    name: formData.get('name'),
                    username: formData.get('username'),
                    phoneNumber: formData.get('phoneNumber'),
                    password: formData.get('password'),
                    password_confirmation: formData.get('password_confirmation')
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(() => {
                    window.location.reload(); // reload agar pesan dari session tampil (opsional)
                })
                .catch(error => {
                    console.error('Registration error:', error);
                });
        });
    </script>
    
@stop
