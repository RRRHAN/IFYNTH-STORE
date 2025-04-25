<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IFYNTH Store</title>
    <!-- Favicon img -->
    <link rel="shortcut icon" href="/assets/images/logo/logo.png">
    <!-- Bootstarp min css -->
    <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
    <!-- All min css -->
    <link rel="stylesheet" href="/assets/css/all.min.css">
    <!-- Swiper bundle min css -->
    <link rel="stylesheet" href="/assets/css/swiper-bundle.min.css">
    <!-- Magnigic popup css -->
    <link rel="stylesheet" href="/assets/css/magnific-popup.css">
    <!-- Animate css -->
    <link rel="stylesheet" href="/assets/css/animate.css">
    <!-- Nice select css -->
    <link rel="stylesheet" href="/assets/css/nice-select.css">
    <!-- Style css -->
    <link rel="stylesheet" href="/assets/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>

<body>
    <div class="modal fade" id="notificationModal" tabindex="-1" aria-labelledby="notificationModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="notificationModalLabel">Notification</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    @if (session('error'))
                        <span>{{ session('error') }}</span>
                    @elseif(session('success'))
                        <span>{{ session('success') }}</span>
                    @endif
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Preloader area start -->
    <div class="loading">
        <span class="text-capitalize">L</span>
        <span>o</span>
        <span>a</span>
        <span>d</span>
        <span>i</span>
        <span>n</span>
        <span>g</span>
    </div>

    <div id="preloader">
    </div>
    <!-- Preloader area end -->

    <!-- Mouse cursor area start here -->
    <div class="mouse-cursor cursor-outer"></div>
    <div class="mouse-cursor cursor-inner"></div>
    <!-- Mouse cursor area end here -->

    @include('layout.navbar')
    @yield('container')
    @include('layout.footer')

    <!-- Jquery 3. 7. 1 Min Js -->
    <script src="/assets/js/jquery-3.7.1.min.js"></script>
    <!-- Bootstrap min Js -->
    <script src="/assets/js/bootstrap.min.js"></script>
    <!-- Swiper bundle min Js -->
    <script src="/assets/js/swiper-bundle.min.js"></script>
    <!-- Counterup min Js -->
    <script src="/assets/js/jquery.counterup.min.js"></script>
    <!-- Wow min Js -->
    <script src="/assets/js/wow.min.js"></script>
    <!-- Magnific popup min Js -->
    <script src="/assets/js/magnific-popup.min.js"></script>
    <!-- Nice select min Js -->
    <script src="/assets/js/nice-select.min.js"></script>
    <!-- Pace min Js -->
    <script src="/assets/js/pace.min.js"></script>
    <!-- Isotope pkgd min Js -->
    <script src="/assets/js/isotope.pkgd.min.js"></script>
    <!-- Waypoints Js -->
    <script src="/assets/js/jquery.waypoints.js"></script>
    <!-- Script Js -->
    <script src="/assets/js/script.js"></script>
    <!-- Menampilkan Modal saat halaman dimuat -->
<script>
    // Jika ada pesan sukses atau error di sesi, tampilkan modal
    @if (session('success') || session('error'))
        var myModal = new bootstrap.Modal(document.getElementById('notificationModal'));
        myModal.show();
    @endif
</script>

</body>

</html>
