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
                                    <a href="/loginForm">sign in</a>
                                    <a class="active" href="#">create account</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-xxl-4">
                            <div class="login__content">
                                <h2 class="text-white mb-65">create account</h2>
                                <div class="form-area login__form">
                                    <!-- Use standard form submission -->
                                    <form id="registrationForm">
                                        @csrf <input type="text" id="name" name="name" placeholder="Full Name"
                                            required>
                                        <input class="mt-30" type="text" id="username" name="username"
                                            placeholder="Username" required>
                                        <input class="mt-30" type="number" id="phoneNumber" name="phoneNumber"
                                            placeholder="Phone Number" required>
                                        <input class="mt-30" type="password" id="password" name="password"
                                            placeholder="Enter Password" required>
                                        <input class="mt-30" type="password" id="password_confirmation"
                                            name="password_confirmation" placeholder="Enter Confirm Password" required>
                                        <div class="radio-btn mt-30" id="termsCheckbox">
                                            <span></span>
                                            <p>I accept your terms & conditions</p>
                                        </div>
                                        <button class="mt-30" type="submit">Create Account</button>
                                    </form>

                                    {{-- Element untuk menampilkan pesan feedback --}}
                                    <div id="feedbackMessage" style="margin-top: 20px; color: green;"></div>
                                    <div id="errorMessage" style="margin-top: 20px; color: red;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </section>
    </main>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const registrationForm = document.getElementById('registrationForm');
            const feedbackMessage = document.getElementById('feedbackMessage');
            const errorMessage = document.getElementById('errorMessage');
            const termsCheckbox = document.getElementById('termsCheckbox');
            let accepted = false;

            // Tampilkan pesan dari localStorage
            const savedFeedback = localStorage.getItem('feedbackMessage');
            if (savedFeedback) {
                feedbackMessage.textContent = savedFeedback;
                localStorage.removeItem('feedbackMessage');
            }

            // Toggle checkbox
            termsCheckbox.addEventListener('click', function() {
                accepted = !accepted;
            });

            registrationForm.addEventListener('submit', async function(event) {
                event.preventDefault();

                // Reset pesan
                feedbackMessage.textContent = '';
                errorMessage.textContent = '';

                if (!accepted) {
                    errorMessage.textContent =
                    'Please accept the terms & conditions before signing in.';
                    return;
                }

                const name = document.getElementById('name').value;
                const username = document.getElementById('username').value;
                const phoneNumber = document.getElementById('phoneNumber').value;
                const password = document.getElementById('password').value;
                const password_confirmation = document.getElementById('password_confirmation').value;

                if (password !== password_confirmation) {
                    errorMessage.textContent = 'Password not match.';
                    return;
                }

                try {
                    let baseUrl = "{{ url(config('app.back_end_base_url')) }}"
                    const response = await axios.post(
                        `${baseUrl}/api/user/register`, {
                            name: name,
                            username: username,
                            phoneNumber: phoneNumber,
                            password: password,
                        }, {
                            headers: {
                                'Authorization': 'Basic ' + btoa('admin:admin'),
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    localStorage.setItem('feedbackMessage', 'Register Successfully!');
                    registrationForm.reset();

                    setTimeout(() => {
                        window.location.href = '/loginForm';
                    }, 500);
                } catch (error) {
                    let message = '';
                    if (error.response) {
                        const status = error.response.status;
                        const data = error.response.data;

                        if (status === 422 && data.errors) {
                            message = Object.values(data.errors).flat().join(', ');
                        } else {
                            message = data.message || 'Registration failed. Please try again.';
                        }
                    } else if (error.request) {
                        message = 'No response from server. Please check your network connection.';
                    } else {
                        message = 'Error: ' + error.message;
                    }

                    errorMessage.textContent = message;
                    console.error('Registration error:', error);
                }
            });
        });
    </script>


@stop
