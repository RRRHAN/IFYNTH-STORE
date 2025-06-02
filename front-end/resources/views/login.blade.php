@extends('layout.master')
@section('container')
    <main>
        <section class="page-banner bg-image">
        </section>
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
                                            {{-- The empty span will be used for the visual indicator --}}
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
            const checkboxSpan = termsCheckbox.querySelector('span'); // Get the span element
            const form = document.querySelector('.login__form form');
            const feedbackMessage = document.getElementById('feedbackMessage');
            const errorMessage = document.getElementById('errorMessage');
            let accepted = false;

            // Function to update the visual state of the checkbox
            function updateCheckboxVisual() {
                if (accepted) {
                    checkboxSpan.classList.add('checked'); // Add a class to indicate "checked"
                } else {
                    checkboxSpan.classList.remove('checked'); // Remove the class
                }
            }

            // Initial visual update
            updateCheckboxVisual();

            // Toggle visual and status
            termsCheckbox.addEventListener('click', function() {
                accepted = !accepted; // Toggle the accepted status
                updateCheckboxVisual(); // Update the visual representation
                // Clear error message when the checkbox state changes
                errorMessage.textContent = '';
            });

            // Validasi sebelum submit
            form.addEventListener('submit', function(e) {
                if (!accepted) {
                    e.preventDefault();
                    errorMessage.textContent = 'Please accept the terms & conditions before signing in.';
                } else {
                    // If accepted, clear any previous error message
                    errorMessage.textContent = '';
                }
            });
        });
    </script>

    {{-- Add some CSS to style the 'checked' state of the span --}}
    <style>
        .radio-btn span {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #ccc;
            border-radius: 50px;
            vertical-align: middle;
            margin-right: 10px;
            cursor: pointer;
            position: relative;
        }

        .radio-btn span.checked {
            background-color: #007bff;
            border-color: #007bff;
        }

        /* Optional: Add a checkmark inside the span when checked */
        .radio-btn span.checked::after {
            content: '';
            position: absolute;
            left: 5px;
            top: 2px;
            width: 6px;
            height: 10px;
            border: solid white;
            border-width: 0 3px 3px 0;
            transform: rotate(45deg);
        }
    </style>
@stop