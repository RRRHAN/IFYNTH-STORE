<!-- Header area start here -->
<div class="top__header top-header-one pt-30 pb-30">
    <div class="container">
        <div class="top__wrapper d-flex justify-content-between align-items-center">
            <a href="index.html" class="main__logo">
                <img src="/assets/images/logo/logo.png" alt="logo__image" style="width: 250px">
            </a>
            <div class="search__wrp">
                <input placeholder="Search for" aria-label="Search">
                <button><i class="fa-solid fa-search"></i></button>
            </div>
            <div class="account__wrap">
                <div class="account d-flex align-items-center">
                    <div class="user__icon">
                        <a href="/dashboard">
                            <i class="fa-regular fa-user"></i>
                        </a>
                    </div>
                    <a href="/dashboard" class="acc__cont">
                        <span class="text-white">
                            {{ session('user_name', 'My Account') }}
                        </span>
                    </a>
                </div>
                <div class="cart d-flex align-items-center">
                    <span class="cart__icon"    onclick="window.location.href='/cart'">
                        <i class="fa-regular fa-cart-shopping"></i>
                    </span>
                    <a href="" class="c__one">
                        <span class="text-white">Cart</span>
                    </a>
                    <span class="one">
                        {{ Session::get('cart_count', 0) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>
<header class="header-section">
    <div class="container">
        <div class="header-wrapper d-flex justify-content-between align-items-center">
            <!-- Sidebar Button (Kiri) -->
            <div class="d-none d-lg-block">
                <button id="openButton" class="side-bar-btn">
                    <i class="fa-sharp text-white fa-light mr-70 fa-bars"></i>
                </button>
            </div>
            <div class="header-bar d-lg-none">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <!-- Main Menu (Tengah) -->
            <ul class="main-menu nav">
                <li class="nav-item">
                    <a class="nav-link" href="/landing">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/catalog/I Found You">I Found You</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/catalog/No Time To Hell">No Time To Hell</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/sellproduct">Sell Your Clothes</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="contact.html">Contact Us</a>
                </li>
            </ul>


            <!-- Shipping Info (Kanan) -->
            <div class="shipping__item d-none d-sm-flex align-items-center">
                <div class="menu__right d-flex align-items-center">
                    <div class="thumb">
                        <img src="/assets/images/flag/shipping.png" alt="image">
                    </div>
                    <div class="content">
                        <p>Free Shipping on order<br> <strong>over Rp. 200.000</strong></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>

<!-- Header area end here -->

<!-- Sidebar area start here -->
<div id="targetElement" class="side_bar slideInRight side_bar_hidden">
    <div class="side_bar_overlay"></div>
    <div class="logo mb-30">
        <img src="/assets/images/logo/logo.png" alt="logo">
    </div>
    <p class="text-justify">The foundation of any road is the subgrade, which provides a stable base for the road
        layers above. Proper compaction of
        the subgrade is crucial to prevent settling and ensure long-term road stability.</p>
    <ul class="info py-4 mt-65 bor-top bor-bottom">
        <li><i class="fa-solid primary-color fa-location-dot"></i> <a href="index-2.html#0">example@example.com</a>
        </li>
        <li class="py-4"><i class="fa-solid primary-color fa-phone-volume"></i> <a href="tel:+912659302003">+91 2659
                302 003</a>
        </li>
        <li><i class="fa-solid primary-color fa-paper-plane"></i> <a href="index-2.html#0">info.company@gmail.com</a>
        </li>
    </ul>
    <div class="social-icon mt-65">
        <a href="index-2.html#0"><i class="fa-brands fa-facebook-f"></i></a>
        <a href="index-2.html#0"><i class="fa-brands fa-twitter"></i></a>
        <a href="index-2.html#0"><i class="fa-brands fa-linkedin-in"></i></a>
        <a href="index-2.html#0"><i class="fa-brands fa-instagram"></i></a>
    </div>
    <button id="closeButton" class="text-white"><i class="fa-solid fa-xmark"></i></button>
</div>
<!-- Sidebar area end here -->
<!-- Modal Notifikasi -->
<div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="loginModalLabel">Alert</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                You must Sign-in first to access this page.
            </div>
            <div class="modal-footer">
                <a href="{{ route('login') }}" class="btn btn-primary">Login</a>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        var userLoggedIn = @json(session('user_logged_in', false));
        var loginModal = new bootstrap.Modal(document.getElementById('loginModal'));

        document.body.addEventListener("click", function (event) {
            var target = event.target.closest(".account a") || event.target.closest(".cart a"); // Cek jika yang diklik adalah link di dalam .account

            if (target && !userLoggedIn) {
                event.preventDefault(); // Mencegah navigasi
                loginModal.show(); // Tampilkan modal
            }
        });
    });
</script>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        // Ambil semua link di menu
        const menuLinks = document.querySelectorAll(".main-menu .nav-link");

        // Ambil URL saat ini
        const currentUrl = window.location.pathname;

        // Loop semua link dan cek apakah URL-nya cocok dengan halaman saat ini
        menuLinks.forEach(link => {
            if (link.getAttribute("href") === currentUrl) {
                link.classList.add("active");
            }
        });
    });

</script>