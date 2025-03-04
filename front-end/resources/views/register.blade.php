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
                            <img src="assets/images/register/res-image1.jpg" alt="image">
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
                                <form action="register.html#0">
                                    <input type="text" placeholder="User Name">
                                    <input class="mt-30" type="email" placeholder="Email">
                                    <input class="mt-30" type="number" placeholder="Phone Number">
                                    <input class="mt-30" type="password" placeholder="Enter Password">
                                    <input class="mt-30" type="password" placeholder="Enter Confirm Password">
                                    <div class="radio-btn mt-30">
                                        <span></span>
                                        <p>I accept your terms & conditions</p>
                                    </div>
                                    <button class="mt-30">Create Account</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </section>
    <!-- Login area end here -->
</main>
@stop