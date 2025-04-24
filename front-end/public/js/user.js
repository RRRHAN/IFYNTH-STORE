import { showNotification } from './utils/notifications.js';

document.addEventListener("DOMContentLoaded", function() {
    // Ambil status user_logged_in dari localStorage
    var userLoggedIn = localStorage.getItem('api_token') !== null;
    var loginModal = new bootstrap.Modal(document.getElementById('loginModal'));

    // Tambahkan event listener untuk menangani klik pada elemen .account atau .cart
    document.body.addEventListener("click", function(event) {
        var target = event.target.closest(".account a") || event.target.closest(".cart a"); // Cek jika yang diklik adalah link di dalam .account atau .cart

        // Jika pengguna belum login, tampilkan modal login
        if (target && !userLoggedIn) {
            event.preventDefault(); // Mencegah navigasi
            loginModal.show(); // Tampilkan modal
        }
    });
});

// REGISTER
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const name = formData.get('name');
        const username = formData.get('username');
        const phoneNumber = formData.get('phoneNumber');
        const password = formData.get('password');
        const password_confirmation = formData.get('password_confirmation');

        if (password !== password_confirmation) {
            showNotification('Password and confirmation do not match.', 'error');
            return;
        }

        axios.post("http://localhost:7777/user/register", {
            name, username, phoneNumber, password, password_confirmation
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('admin:admin')
            }
        })
        .then(response => {
            const errors = response.data.errors;
            if (!errors || errors.length === 0) {
                showNotification("User registered successfully!", 'success', () => {
                    window.location.href = "/login";
                });
            } else {
                showNotification(errors[0] || "Failed to register", 'error');
            }
        })
        .catch(error => {
            const message = error.response?.data?.errors?.[0] || "An error occurred";
            showNotification(message, 'error');
        });
    });
}

// LOGIN
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const username = formData.get('username');
        const password = formData.get('password');

        if (!username || !password) {
            showNotification('Username and password are required.', 'error');
            return;
        }

        axios.post("http://localhost:7777/user/login", {
            username, password, role: 'CUSTOMER'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('admin:admin')
            }
        })
        .then(response => {
            const responseData = response.data;
            if (responseData.data?.token && !responseData.errors) {
                localStorage.setItem('api_token', responseData.data.token);
                localStorage.setItem('token_expiry', responseData.data.expires);
                localStorage.setItem('username', username);

                showNotification('Login successful', 'success', () => {
                    window.location.href = '/';
                });
            } else {
                const errorMessage = Array.isArray(responseData.errors)
                    ? responseData.errors[0]
                    : responseData.errors;
                showNotification(errorMessage || 'Failed to login', 'error');
            }
        })
        .catch(error => {
            const message = error.response?.data?.errors?.[0] || 'An error occurred during login';
            showNotification(message, 'error');
        });
    });
}

// LOGOUT
const logoutForm = document.getElementById('logout-btn');
if (logoutForm) {
    logoutForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const token = localStorage.getItem('api_token');
        if (!token) {
            console.error('No token found in localStorage');
            return;
        }

        axios.post('http://localhost:7777/user/logout', {}, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            localStorage.removeItem('api_token');
            localStorage.removeItem('token_expiry');
            localStorage.removeItem('username');

            showNotification('Logout successful!', 'success', () => {
                window.location.href = '/landing';
            });
        })
        .catch(error => {
            console.error('Logout error:', error);
            showNotification('Logout failed. Please try again.', 'error');
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // Ambil username dari localStorage
    var username = localStorage.getItem('username');
    
    // Temukan elemen yang akan menampilkan username
    var usernameElement = document.getElementById('username-span');
    
    // Tampilkan username di elemen tersebut
    if (username) {
        usernameElement.textContent = username;
    } else {
        usernameElement.textContent = 'My Account'; // Jika tidak ada username, tampilkan 'Guest'
    }
});
