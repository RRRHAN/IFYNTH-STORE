@extends('layout.master')
@section('container')
    <main>
        <!-- Page banner area start here -->
        <section class="page-banner bg-image">
        </section>
        <!-- Page banner area end here -->
        <!-- Login area start here -->
        <section class="login-area pt-30 pb-130">
            <div class="container">
                <div class="login__item">
                    <div class="row g-4">
                        <div class="col-xxl-8">
                            <div class="login__image">
                                <img src="/assets/images/login/login-banner.jpg" alt="image">
                                <div class="btn-wrp">
                                    <a class="active" href="#">sign in</a>
                                    <a href="/registerForm">create account</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-xxl-4">
                            <div class="login__content">
                                <h2 class="text-white mb-65">Welcome</h2>
                                <div class="form-area login__form">
                                    <form action="{{ route('login.proccess') }}" method="POST">
                                        @csrf
                                        <input for="" type="text" name="username" placeholder="Username">
                                        <input class="mt-30" type="password" name="password" placeholder="Enter Password">
                                        <div class="radio-btn mt-30" id="termsCheckbox">
                                            <span></span>
                                            <p>I accept your terms & conditions</p>
                                        </div>
                                        <button class="mt-30">Sign In</button>
                                    </form>
                                    {{-- Element untuk menampilkan pesan feedback --}}
                                    <div id="feedbackMessage" style="margin-top: 20px; color: green;"></div>
                                    <div id="errorMessage" style="margin-top: 20px; color: red;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const termsCheckbox = document.getElementById('termsCheckbox');
            const form = document.querySelector('.login__form form');
            const feedbackMessage = document.getElementById('feedbackMessage');
            const errorMessage = document.getElementById('errorMessage');
            let accepted = false;

            // Toggle visual dan status
            termsCheckbox.addEventListener('click', function() {
                accepted = !accepted;
            });

            // Validasi sebelum submit
            form.addEventListener('submit', function(e) {
                if (!accepted) {
                    e.preventDefault();
                    errorMessage.textContent = (
                        'Please accept the terms & conditions before signing in.');
                }
            });
        });
    </script>

@stop
