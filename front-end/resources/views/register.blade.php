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
                                    <form id="registrationForm">
                                        @csrf
                                        <input type="text" id="name" name="name" placeholder="Full Name" required>
                                        <input class="mt-30" type="text" id="username" name="username" placeholder="Username" required>

                                        {{-- Phone Number Input with static +62 prefix --}}
                                        <div class="input-group mt-30">
                                            <span class="input-group-text">+62</span>
                                            <input type="text" class="form-control" id="phoneNumber" name="phoneNumber"
                                                placeholder="81234567890" required
                                                pattern="[0-9]{8,15}"
                                                title="Please enter a valid phone number (8-15 digits, no leading 0)">
                                        </div>
                                        {{-- End Phone Number Input --}}

                                        <input class="mt-30" type="password" id="password" name="password" placeholder="Enter Password" required>
                                        <input class="mt-30" type="password" id="password_confirmation"
                                            name="password_confirmation" placeholder="Enter Confirm Password" required>

                                        {{-- Terms & Conditions Checkbox --}}
                                        <div class="radio-btn mt-30" id="termsCheckbox">
                                            <span></span> {{-- This span will be the visual indicator --}}
                                            <p>I accept your terms & conditions</p>
                                        </div>
                                        {{-- End Terms & Conditions Checkbox --}}

                                        <button class="mt-30" type="submit">Create Account</button>
                                    </form>

                                    {{-- Element to display feedback messages --}}
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

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script> {{-- Ensure axios is included --}}
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const registrationForm = document.getElementById('registrationForm');
            const feedbackMessage = document.getElementById('feedbackMessage');
            const errorMessage = document.getElementById('errorMessage');
            const termsCheckbox = document.getElementById('termsCheckbox');
            const checkboxSpan = termsCheckbox.querySelector('span'); // Get the span for visual feedback
            let accepted = false;

            // --- Phone Number Input Logic ---
            const phoneNumberInput = document.getElementById('phoneNumber');
            phoneNumberInput.addEventListener('input', function() {
                // Remove non-digit characters
                this.value = this.value.replace(/[^0-9]/g, '');
                // Remove leading '0' if present
                if (this.value.startsWith('0')) {
                    this.value = this.value.substring(1);
                }
            });
            // --- End Phone Number Logic ---

            // --- Terms & Conditions Checkbox Visual Logic ---
            // Function to update the visual appearance of the checkbox
            function updateCheckboxVisual() {
                if (accepted) {
                    checkboxSpan.classList.add('checked'); // Add class for 'checked' appearance
                } else {
                    checkboxSpan.classList.remove('checked'); // Remove class if not 'checked'
                }
            }

            // Initialize checkbox visual appearance on page load
            updateCheckboxVisual();

            // Toggle checkbox status and update visual on click
            termsCheckbox.addEventListener('click', function() {
                accepted = !accepted; // Toggle status
                updateCheckboxVisual(); // Update visual feedback
                errorMessage.textContent = ''; // Clear error message when checkbox is interacted with
            });
            // --- End Terms & Conditions Checkbox Visual Logic ---

            // Display feedback message from localStorage
            const savedFeedback = localStorage.getItem('feedbackMessage');
            if (savedFeedback) {
                feedbackMessage.textContent = savedFeedback;
                feedbackMessage.style.display = 'block'; // Ensure it's visible
                localStorage.removeItem('feedbackMessage');
                setTimeout(() => {
                    feedbackMessage.style.display = 'none'; // Hide after a few seconds
                }, 3000);
            }

            registrationForm.addEventListener('submit', async function(event) {
                event.preventDefault(); // Prevent default form submission

                // Reset messages
                feedbackMessage.textContent = '';
                feedbackMessage.style.display = 'none';
                errorMessage.textContent = '';
                errorMessage.style.display = 'none';

                // Validate terms & conditions
                if (!accepted) {
                    errorMessage.textContent = 'Please accept the Terms & Conditions to create an account.';
                    errorMessage.style.display = 'block';
                    return;
                }

                const name = document.getElementById('name').value.trim();
                const username = document.getElementById('username').value.trim();
                const phoneNumber = document.getElementById('phoneNumber').value.trim(); // Already cleaned of +62 and leading 0
                const password = document.getElementById('password').value;
                const password_confirmation = document.getElementById('password_confirmation').value;

                // Validate empty inputs (additional)
                if (!name || !username || !phoneNumber || !password || !password_confirmation) {
                    errorMessage.textContent = 'All fields are required.';
                    errorMessage.style.display = 'block';
                    return;
                }

                if (password !== password_confirmation) {
                    errorMessage.textContent = 'Password confirmation does not match.';
                    errorMessage.style.display = 'block';
                    return;
                }

                // Validate phone number format
                if (phoneNumber.length < 8 || phoneNumber.length > 15 || !/^[0-9]+$/.test(phoneNumber)) {
                    errorMessage.textContent = 'Invalid phone number. Please enter 8-15 digits only.';
                    errorMessage.style.display = 'block';
                    return;
                }

                try {
                    let baseUrl = "{{ config('app.back_end_base_url') }}"; // Get from Laravel config
                    if (!baseUrl) {
                        console.error("`config('app.back_end_base_url')` is not set. Please define it in your Laravel config.");
                        errorMessage.textContent = 'API URL configuration not found.';
                        errorMessage.style.display = 'block';
                        return;
                    }

                    const response = await axios.post(
                        `${baseUrl}/api/user/register`, {
                            name: name,
                            username: username,
                            phoneNumber: phoneNumber, // This will be sent to the DB without +62 and leading 0
                            password: password,
                        }, {
                            headers: {
                                'Authorization': 'Basic ' + btoa('admin:admin'), // Ensure this is handled securely on the client-side
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    localStorage.setItem('feedbackMessage', 'Registration Successful! Please log in.');
                    registrationForm.reset(); // Clear the form
                    updateCheckboxVisual(); // Reset checkbox visual after form reset

                    setTimeout(() => {
                        window.location.href = '/loginForm';
                    }, 500); // Redirect after 0.5 seconds
                } catch (error) {
                    let message = '';
                    if (error.response) {
                        const status = error.response.status;
                        const data = error.response.data;

                        if (status === 422 && data.errors) {
                            // If there are validation errors from the backend (e.g., username already exists)
                            message = Object.values(data.errors).flat().join(', ');
                        } else if (data.message) {
                            // General error message from the backend
                            message = data.message;
                        } else {
                            message = `Registration failed. Status: ${status}. Please try again.`;
                        }
                    } else if (error.request) {
                        message = 'No response from the server. Please check your network connection.';
                    } else {
                        message = 'An error occurred: ' + error.message;
                    }

                    errorMessage.textContent = message;
                    errorMessage.style.display = 'block';
                    console.error('Registration error:', error);
                }
            });
        });
    </script>

    <style>
        .input-group {
            display: flex;
            width: 100%;
        }
        .input-group-text {
            background-color: #e9ecef00; /* Transparent background */
            border: 1px solid #c0c0c06a;
            border-right: none;
            border-left: none; /* No left border */
            border-top: none;  /* No top border */
            padding: 0.375rem 0.75rem;
            font-weight: 400;
            line-height: 1.5;
            color: #6a737c;
            text-align: center;
            white-space: nowrap;
            border-top-left-radius: 0.25rem;
            border-bottom-left-radius: 0.25rem;
            padding-right: 12px; /* This adds the space between +62 and the input */
        }
        .input-group .form-control {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            /* Ensure the input itself has the correct border styles */
            border: 1px solid #c0c0c06a;
            border-top: none;
            border-right: none; /* If you want no right border like the current design */
            border-bottom: none;
            /* Add padding bottom to align with input-group-text padding if needed for visual consistency */
            padding-bottom: 0.375rem; /* Match input-group-text vertical padding */
        }

        /* Specific styles for the login form's inputs to match the current style if it has a bottom border */
        .login__form input[type="text"],
        .login__form input[type="password"],
        .login__form .input-group .form-control {
            background-color: transparent; /* Assuming your existing inputs are transparent */
            border: none;
            border-bottom: 1px solid #4a4a4a; /* Matches the visual style from your original code */
            color: #fff; /* White text for input */
            outline: none; /* Remove outline on focus */
            padding: 10px 0; /* Adjust padding as needed */
        }

        /* Override specific styles for the input-group-text border to match the input if desired */
        .login__form .input-group-text {
            border-bottom: 1px solid #4a4a4a; /* Match input bottom border */
            background-color: transparent;
            color: #fff;
        }

        /* Focus styles for the input group */
        .login__form .input-group:focus-within .input-group-text,
        .login__form .input-group:focus-within .form-control {
            border-color: #007bff; /* Example focus color */
        }


        .radio-btn span {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #ccc;
            border-radius: 4px;
            vertical-align: middle;
            margin-right: 10px;
            cursor: pointer;
            position: relative;
        }

        .radio-btn span.checked {
            background-color: #007bff;
            border-color: #007bff;
        }

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