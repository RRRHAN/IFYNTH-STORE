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
                                    <a class="active" href="/login">sign in</a>
                                    <a href="/register">create account</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-xxl-4">
                            <div class="login__content">
                                <h2 class="text-white mb-65">Welcome</h2>
                                <div class="form-area login__form">
                                    <form id="login-form">
                                        @csrf
                                        <input for="" type="text" name="username" placeholder="Username">
                                        <input class="mt-30" type="password" name="password" placeholder="Enter Password">
                                        <div class="radio-btn mt-30">
                                            <span></span>
                                            <p>I accept your terms & conditions</p>
                                        </div>
                                        <button class="mt-30">Sign In</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- Login area end here -->
        <script type="module" src="/js/user.js"></script>
    </main>
@stop
