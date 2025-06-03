/*-----------------------------------------------------------------

Template Name:  Odor - Vape Store WooCommerce HTML Template
Author:  Gramentheme
Author URI: https://themeforest.net/user/gramentheme/portfolio
Developer: Kawser Ahmed Roni
Version: 1.0.0
Description: Odor - Vape Store WooCommerce HTML Templatee

-------------------------------------------------------------------
CSS TABLE OF CONTENTS
-------------------------------------------------------------------

01. preloader
02. header
03. swiper slider
04. animated text with swiper slider
05. shop products count
06. image src change
07. hide & show a div
08. isotope
09. add class & remove class
10. magnificPopup
11. back to top
12. data backgrund
13. coundown by click
14. remove products
15. wow animation
15. Custom cursor

------------------------------------------------------------------*/

(function ($) {
    ("use strict");

    $(".header-bar").on("click", function (e) {
        $(".main-menu, .header-bar").toggleClass("active");
    });
    $(".main-menu li a").on("click", function (e) {
        var element = $(this).parent("li");
        if (element.hasClass("open")) {
            element.removeClass("open");
            element.find("li").removeClass("open");
            element.find("ul").slideUp(300, "swing");
        } else {
            element.addClass("open");
            element.children("ul").slideDown(300, "swing");
            element.siblings("li").children("ul").slideUp(300, "swing");
            element.siblings("li").removeClass("open");
            element.siblings("li").find("li").removeClass("open");
            element.siblings("li").find("ul").slideUp(300, "swing");
        }
    });
    // Fungsi untuk menerapkan/menghapus style berdasarkan scroll dan lebar layar
    function handleHeaderFixed() {
        var fixed_top = $(".header-section");
        var scroll_top = $(window).scrollTop();
        var isSmallScreen = window.matchMedia("(max-width: 1199px)").matches;

        if (scroll_top > 220) {
            fixed_top.addClass("menu-fixed animated fadeInDown");
            fixed_top.removeClass("slideInUp");
            $("body").addClass("body-padding");

            if (isSmallScreen) {
                fixed_top.css("top", "0px");
            } else {
                fixed_top.css("top", "");
            }
        } else {
            fixed_top.removeClass("menu-fixed fadeInDown");
            fixed_top.addClass("slideInUp");
            $("body").removeClass("body-padding");
            if (isSmallScreen) {
                fixed_top.css("top", "100px");
            } else {
                fixed_top.css("top", "");
            }
        }
    }
    $(document).ready(function () {
        handleHeaderFixed();
    });
    $(window).on("scroll", handleHeaderFixed);
    $(window).on("resize", handleHeaderFixed);

    // Preloader area start here ***
    paceOptions = {
        ajax: true,
        document: true,
        eventLag: false,
    };

    Pace.on("done", function () {
        $("#preloader").addClass("isdone");
        $(".loading").addClass("isdone");
        $(".loading").addClass("d-none");
    });
    // Preloader area end here ***

    // Banner five slider area end here ***
    var sliderActive3 = ".banner-two__slider";
    var sliderInit3 = new Swiper(sliderActive3, {
        loop: true,
        slidesPerView: 1,
        effect: "fade",
        speed: 3000,
        autoplay: {
            delay: 7000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".banner-two__arry-next",
            prevEl: ".banner-two__arry-prev",
        },
    });
    // Here this is use for animate ***
    function animated_swiper(selector, init) {
        var animated = function animated() {
            $(selector + " [data-animation]").each(function () {
                var anim = $(this).data("animation");
                var delay = $(this).data("delay");
                var duration = $(this).data("duration");
                $(this)
                    .removeClass("anim" + anim)
                    .addClass(anim + " animated")
                    .css({
                        webkitAnimationDelay: delay,
                        animationDelay: delay,
                        webkitAnimationDuration: duration,
                        animationDuration: duration,
                    })
                    .one("animationend", function () {
                        $(this).removeClass(anim + " animated");
                    });
            });
        };
        animated();
        init.on("slideChange", function () {
            $(sliderActive3 + " [data-animation]").removeClass("animated");
        });
        init.on("slideChange", animated);
    }
    animated_swiper(sliderActive3, sliderInit3);
    // Banner five slider area end here ***

    // Product slider area start here ***
    var swiper = new Swiper(".product__slider", {
        spaceBetween: 24,
        speed: 300,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".product__dot",
            clickable: true,
        },
        breakpoints: {
            575: {
                slidesPerView: 2,
            },
        },
    });
    // Product slider area end here ***

    // Gallery slider area start here ***
    var swiper = new Swiper(".gallery__slider", {
        spaceBetween: 30,
        speed: 300,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        breakpoints: {
            1300: {
                slidesPerView: 4,
            },
            991: {
                slidesPerView: 3,
            },
            768: {
                slidesPerView: 2,
            },
        },
    });
    // Gallery slider area end here ***

    // Category slider area start here ***
    var swiper = new Swiper(".category__slider", {
        spaceBetween: 30,
        speed: 500,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        breakpoints: {
            1440: {
                slidesPerView: 6,
            },
            1300: {
                slidesPerView: 5,
            },
            991: {
                slidesPerView: 4,
            },
            768: {
                slidesPerView: 3,
            },
            500: {
                slidesPerView: 2,
            },
        },
    });
    // Category slider area end here ***

    // Brand slider area start here ***
    var swiper = new Swiper(".brand__slider", {
        spaceBetween: 30,
        speed: 300,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        breakpoints: {
            1440: {
                slidesPerView: 6,
            },
            1300: {
                slidesPerView: 5,
            },
            991: {
                slidesPerView: 4,
            },
            768: {
                slidesPerView: 3,
            },
            500: {
                slidesPerView: 2,
            },
        },
    });
    // Brand slider area end here ***

    // Testimonial two slider area start here ***
    var swiper = new Swiper(".testimonial__slider", {
        loop: "true",
        spaceBetween: 20,
        speed: 500,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        // pagination: {
        // 	el: ".testimonial-two__dot",
        // 	clickable: true,
        // },
        navigation: {
            nextEl: ".testimonial__arry-next",
            prevEl: ".testimonial__arry-prev",
        },
    });
    // Testimonial two slider area end here ***

    // Blog slider area start here ***
    var swiper = new Swiper(".blog__slider", {
        loop: "true",
        spaceBetween: 30,
        speed: 500,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".blog__dot",
            clickable: true,
        },
    });
    // Blog slider area end here ***

    // Get swiper slider area start here ***
    var swiper = new Swiper(".get__slider", {
        loop: "true",
        spaceBetween: 10,
        speed: 300,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".get-now__arry-right",
            prevEl: ".get-now__arry-left",
        },
    });
    // Get swiper slider area end here ***

    // Isotope area start here ***
    var $grid = $(".filter__items").isotope({});
    // click here
    $(".filter__list").on("click", "li", function () {
        var filterValue = $(this).attr("data-filter");
        $grid.isotope({ filter: filterValue });
    });
    // change is-checked class on buttons
    $(".filter__list").each(function (i, buttonGroup) {
        var $buttonGroup = $(buttonGroup);
        $buttonGroup.on("click", "li", function () {
            $buttonGroup.find(".active").removeClass("active");
            $(this).addClass("active");
        });
    });
    // Isotope area end here ***

    // Background image date area start here ***
    $("[data-background").each(function () {
        $(this).css(
            "background-image",
            "url( " + $(this).attr("data-background") + "  )"
        );
    });
    // Background image date area end here ***

    // Video popup area start here ***
    $(".video-popup").magnificPopup({
        type: "iframe",
        iframe: {
            markup:
                '<div class="mfp-iframe-scaler">' +
                '<div class="mfp-close"></div>' +
                '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
                "</div>",

            patterns: {
                youtube: {
                    index: "youtube.com/",

                    id: "v=",

                    src: "https://www.youtube.com/embed/%id%?autoplay=1",
                },
                vimeo: {
                    index: "vimeo.com/",
                    id: "/",
                    src: "//player.vimeo.com/video/%id%?autoplay=1",
                },
                gmaps: {
                    index: "//maps.google.",
                    src: "%id%&output=embed",
                },
            },

            srcAction: "iframe_src",
        },
    });
    // Video popup area end here ***

    // Map popup area start here ***
    $(".map-popup").magnificPopup({
        disableOn: 700,
        type: "iframe",
        mainClass: "mfp-fade",
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
    });
    // Map popup area end here ***

    // Counter up area start here ***
    $(".count").counterUp({
        delay: 20,
        time: 3000,
    });
    // Counter up area end here ***

    // Countdown area start here ***
    var targetDate = new Date("2023-12-01 00:00:00").getTime();
    // fix you date here
    var countdownInterval = setInterval(function () {
        var currentDate = new Date().getTime();
        var remainingTime = targetDate - currentDate;

        var days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
            (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor(
            (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        // Pad single-digit values with leading zeros
        $("#day").text(days.toString().padStart(2, "0"));
        $("#hour").text(hours.toString().padStart(2, "0"));
        $("#min").text(minutes.toString().padStart(2, "0"));
        $("#sec").text(seconds.toString().padStart(2, "0"));

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            // You can add a message or perform any action when the countdown timer reaches zero
        }
    }, 1000);
    // Countdown area end here ***

    // Shop single swiper slider area start here ***
    var swiper = new Swiper(".shop-slider-thumb", {
        loop: true,
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
        navigation: {
            nextEl: ".right-arry",
            prevEl: ".left-arry",
        },
    });

    var swiper2 = new Swiper(".shop-single-slide", {
        loop: true,
        spaceBetween: 20,
        speed: 300,
        grabCursor: true,
        navigation: {
            nextEl: ".right-arry",
            prevEl: ".left-arry",
        },
        thumbs: {
            swiper: swiper,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
    });
    // Shop single swiper slider area end here ***

    // Shop count js area start here ***
    $(".quantity").on("click", ".plus", function (e) {
        let $input = $(this).prev("input.qty");
        let val = parseInt($input.val(), 10); // Specify base 10
        $input.val(val + 1).change();
    });
    $(".quantity").on("click", ".minus", function (e) {
        let $input = $(this).next("input.qty");
        var val = parseInt($input.val(), 10); // Specify base 10
        if (val > 0) {
            $input.val(val - 1).change();
        }
    });
    // Shop count js area end here ***

    // Shop image zoom js area start here ***
    // $(document).ready(function () {
    // 	$(".product-image-container")
    // 		.on("mousemove", function (e) {
    // 			var parentOffset = $(this).offset();
    // 			var relX = e.pageX - parentOffset.left;
    // 			var relY = e.pageY - parentOffset.top;
    // 			var width = $(this).width();
    // 			var height = $(this).height();
    // 			var zoomX = (relX / width) * 100;
    // 			var zoomY = (relY / height) * 100;
    // 			$(this)
    // 				.find(".zoomed-image")
    // 				.css({
    // 					"background-image": "url(assets/images/shop/02.jpg)", // Path to your product image
    // 					"background-position": zoomX + "% " + zoomY + "%",
    // 					display: "block",
    // 				});
    // 		})
    // 		.mouseleave(function () {
    // 			$(this).find(".zoomed-image").hide();
    // 		});
    // });

    // Shop image zoom js area end here ***

    // Hide & show by clicks js area start here ***
    $(document).on("click", "#openButton", function () {
        $("#targetElement").removeClass("side_bar_hidden");
    });
    $(document).on("click", "#closeButton", function () {
        $("#targetElement").addClass("side_bar_hidden");
    });
    // Hide & show by clicks js area end here ***

    // Radio btn area start here ***
    $(document).on("click", ".radio-btn span", function () {
        $(this).toggleClass("radio-btn-active");
    });
    // Radio btn area end here ***

    // Mouse cursor area start here ***
    function mousecursor() {
        if ($("body")) {
            const e = document.querySelector(".cursor-inner"),
                t = document.querySelector(".cursor-outer");
            let n,
                i = 0,
                o = !1;
            (window.onmousemove = function (s) {
                o ||
                    (t.style.transform =
                        "translate(" + s.clientX + "px, " + s.clientY + "px)"),
                    (e.style.transform =
                        "translate(" + s.clientX + "px, " + s.clientY + "px)"),
                    (n = s.clientY),
                    (i = s.clientX);
            }),
                $("body").on("mouseenter", "a, .cursor-pointer", function () {
                    e.classList.add("cursor-hover"),
                        t.classList.add("cursor-hover");
                }),
                $("body").on("mouseleave", "a, .cursor-pointer", function () {
                    ($(this).is("a") &&
                        $(this).closest(".cursor-pointer").length) ||
                        (e.classList.remove("cursor-hover"),
                        t.classList.remove("cursor-hover"));
                }),
                (e.style.visibility = "visible"),
                (t.style.visibility = "visible");
        }
    }

    $(function () {
        mousecursor();
    });
    // Mouse cursor area end here ***

    // Nice seclect area start here ***
    $(document).ready(function () {
        $("select").niceSelect();
    });
    // Nice seclect area end here ***

    // Back to top area start here ***
    var scrollPath = document.querySelector(".scroll-up path");
    var pathLength = scrollPath.getTotalLength();
    scrollPath.style.transition = scrollPath.style.WebkitTransition = "none";
    scrollPath.style.strokeDasharray = pathLength + " " + pathLength;
    scrollPath.style.strokeDashoffset = pathLength;
    scrollPath.getBoundingClientRect();
    scrollPath.style.transition = scrollPath.style.WebkitTransition =
        "stroke-dashoffset 10ms linear";
    var updatescroll = function () {
        var scroll = $(window).scrollTop();
        var height = $(document).height() - $(window).height();
        var scroll = pathLength - (scroll * pathLength) / height;
        scrollPath.style.strokeDashoffset = scroll;
    };
    updatescroll();
    $(window).scroll(updatescroll);
    var offset = 50;
    var duration = 950;
    jQuery(window).on("scroll", function () {
        if (jQuery(this).scrollTop() > offset) {
            jQuery(".scroll-up").addClass("active-scroll");
        } else {
            jQuery(".scroll-up").removeClass("active-scroll");
        }
    });
    jQuery(".scroll-up").on("click", function (event) {
        event.preventDefault();
        jQuery("html, body").animate(
            {
                scrollTop: 0,
            },
            duration
        );
        return false;
    });
    // Back to top area end here ***

    // Change the root color area start here ***
    function setThemeColor(color) {
        const root = document.documentElement;
        root.setAttribute("data-theme", color);
    }
    // Change the root color area end here ***

    // WOW Animatin area start here ***
    new WOW().init();
    // WOW Animatin area start here ***

    $(document).ready(function () {
        const provinces = {
            Aceh: ["Banda Aceh", "Lhokseumawe", "Langsa", "Meulaboh"],
            Bali: ["Denpasar", "Gianyar", "Tabanan"],
            Banten: ["Serang", "Tangerang", "Cilegon", "Lebak"],
            Bengkulu: ["Bengkulu", "Mukomuko"],
            "DI Yogyakarta": ["Yogyakarta", "Bantul", "Gunungkidul"],
            "DKI Jakarta": [
                "Jakarta Pusat",
                "Jakarta Selatan",
                "Jakarta Barat",
            ],
            Gorontalo: ["Gorontalo", "Limboto"],
            Jambi: ["Jambi", "Muaro Jambi"],
            "Jawa Barat": ["Bandung", "Bekasi", "Bogor", "Depok"],
            "Jawa Tengah": ["Semarang", "Solo", "Tegal", "Magelang"],
            "Jawa Timur": ["Surabaya", "Malang", "Kediri", "Sidoarjo"],
            "Kalimantan Barat": ["Pontianak", "Singkawang"],
            "Kalimantan Selatan": ["Banjarmasin", "Banjarbaru"],
            "Kalimantan Tengah": ["Palangka Raya", "Sampit"],
            "Kalimantan Timur": ["Samarinda", "Balikpapan"],
            "Kalimantan Utara": ["Tanjung Selor"],
            "Kepulauan Bangka Belitung": ["Pangkal Pinang"],
            "Kepulauan Riau": ["Tanjung Pinang", "Batam"],
            Lampung: ["Bandar Lampung", "Metro"],
            Maluku: ["Ambon", "Tual"],
            "Maluku Utara": ["Ternate", "Tidore"],
            "Nusa Tenggara Barat": ["Mataram", "Bima"],
            "Nusa Tenggara Timur": ["Kupang", "Ende"],
            Papua: ["Jayapura", "Biak"],
            "Papua Barat": ["Manokwari", "Sorong"],
            Riau: ["Pekanbaru", "Dumai"],
            "Sulawesi Barat": ["Mamuju"],
            "Sulawesi Selatan": ["Makassar", "Parepare"],
            "Sulawesi Tengah": ["Palu", "Poso"],
            "Sulawesi Tenggara": ["Kendari", "Baubau"],
            "Sulawesi Utara": ["Manado", "Bitung"],
            "Sumatera Barat": ["Padang", "Bukittinggi"],
            "Sumatera Selatan": ["Palembang", "Lubuk Linggau"],
            "Sumatera Utara": ["Medan", "Binjai"],
        };

        const $provinceSelect = $("#province");
        const $citySelect = $("#city");

        // Populate province dropdown
        $.each(provinces, function (province, cities) {
            $provinceSelect.append(
                $("<option>", { value: province, text: province })
            );
        });

        // Handle province change
        $provinceSelect.on("change", function () {
            let selectedProvince = $(this).val();
            $citySelect.empty().append('<option value="">Select City</option>');

            if (selectedProvince in provinces) {
                $.each(provinces[selectedProvince], function (index, city) {
                    $citySelect.append(
                        $("<option>", { value: city, text: city })
                    );
                });
            }
        });
    });
})(jQuery);
(function ($) {
    "use strict";

    // ... (Your other JavaScript code) ...

    // --- Search Input Toggle Logic ---
    var searchWrapper = $(".top__header .top__wrapper .search__wrp");
    var searchInput = searchWrapper.find("input[name='keyword']");
    var searchButton = searchWrapper.find("button"); // Get the button within the wrapper

    searchButton.on("click", function (e) {
        // Prevent default form submission initially
        e.preventDefault();

        // Check if we are on a small screen where the input is initially hidden
        var isSmallScreen = window.matchMedia("(max-width: 1199px)").matches;

        if (isSmallScreen) {
            if (!searchWrapper.hasClass("search-active")) {
                // If input is currently hidden, show it
                searchWrapper.addClass("search-active");
                searchInput.focus(); // Focus the input field

                // Optional: Listen for clicks outside to hide the input if it's empty
                // This improves UX, but requires a way to disable it when user types
                setTimeout(() => {
                    // Add a slight delay to allow focus
                    $(document).one("click", function (event) {
                        if (
                            !searchWrapper.is(event.target) &&
                            searchWrapper.has(event.target).length === 0
                        ) {
                            if (searchInput.val().trim() === "") {
                                searchWrapper.removeClass("search-active");
                            }
                        }
                    });
                }, 100);
            } else {
                // If input is currently visible
                if (searchInput.val().trim() !== "") {
                    // If there's text, submit the form
                    $(this).closest("form").submit();
                } else {
                    // If input is empty, hide it again
                    searchWrapper.removeClass("search-active");
                    searchInput.blur(); // Remove focus
                }
            }
        } else {
            // On larger screens, just submit the form normally
            $(this).closest("form").submit();
        }
    });

    // Handle pressing 'Enter' key inside the search input
    searchInput.on("keydown", function (e) {
        if (e.key === "Enter") {
            // Prevent default behavior (e.g., newline in some inputs)
            e.preventDefault();
            // Trigger a click on the search button, which handles submission logic
            searchButton.trigger("click");
        }
    });

    // Optional: Hide input if Esc key is pressed and input is empty
    $(document).on("keydown", function (e) {
        var isSmallScreen = window.matchMedia("(max-width: 1199px)").matches;
        if (
            isSmallScreen &&
            e.key === "Escape" &&
            searchWrapper.hasClass("search-active") &&
            searchInput.val().trim() === ""
        ) {
            searchWrapper.removeClass("search-active");
            searchInput.blur();
        }
    });

    // Optional: If screen resizes from small to large, ensure input is visible
    $(window).on("resize", function () {
        var isSmallScreen = window.matchMedia("(max-width: 1199px)").matches;
        if (!isSmallScreen) {
            searchWrapper.removeClass("search-active"); // Remove active class if it was there
            // Ensure input is 'display: block' or 'inline-block' on large screens via CSS default
        }
    });

    // ... (Your other JavaScript code) ...
})(jQuery);
(function ($) {
    "use strict";

    $(document).ready(function () {
        // --- 1. INISIALISASI SEMUA FITUR SAAT DOM SIAP ---

        // Fungsi untuk mengelola fitur "View More Products" / "Hide Products"
        initProductToggle();

        // Fungsi untuk mengelola fitur "Payment Modal"
        initPaymentModal();

        // Fungsi untuk mengelola fitur "Shipping Address Modal"
        initShippingAddressModal();

    }); // End of $(document).ready()


    // --- 2. DEFINISI FUNGSI-FUNGSI FITUR SECARA TERPISAH ---

    /**
     * Menginisialisasi logika untuk menampilkan/menyembunyikan produk di pesanan.
     */
    function initProductToggle() {
        $("#my-order").on("click", ".view-more-btn", function () {
            const $button = $(this);
            const $orderBody = $button.closest(".order-body");
            const $hiddenItems = $orderBody.find(
                ".product-item-order.hidden-product-item-order"
            );

            $hiddenItems.slideToggle("fast", function () {
                if ($(this).is(":visible")) {
                    $(this).css("display", "flex");
                }
                if ($hiddenItems.first().is(":visible")) {
                    $button.html(
                        'Hide Products <i class="fas fa-chevron-up ms-2"></i>'
                    );
                } else {
                    const totalHidden = $hiddenItems.length;
                    $button.html(
                        `View All Products (${totalHidden} more) <i class="fas fa-chevron-down ms-2"></i>`
                    );
                }
            });
        });
    }
    function initPaymentModal() {
        const paymentModal = $("#paymentModal");
        const modalTransactionId = $("#modalTransactionId");
        const modalTotalAmountDisplay = $("#modalTotalAmount");
        const modalPaymentMethodDisplay = $("#modalPaymentMethod");
        const modalTotalAmountValueInput = $("#modalTotalAmountValue");
        const modalPaymentMethodValueInput = $("#modalPaymentMethodValue");

        paymentModal.on("show.bs.modal", function (event) {
            const button = $(event.relatedTarget);
            const transactionId = button.data("transaction-id");
            const totalAmount = button.data("total-amount");
            const paymentMethod = button.data("payment-method");

            modalTransactionId.val(transactionId);
            modalTotalAmountDisplay.text(`Rp${totalAmount}`);
            modalPaymentMethodDisplay.text(paymentMethod);
            modalTotalAmountValueInput.val(totalAmount.replace(/,/g, ""));
            modalPaymentMethodValueInput.val(paymentMethod);
        });
    }
 function initShippingAddressModal() {
    const shippingAddressModal = $('#shippingAddressModal');
    const modalRecipientName = $('#modalRecipientName');
    const modalPhoneNumber = $('#modalPhoneNumber');
    const modalAddress = $('#modalAddress');
    const modalZipCode = $('#modalZipCode');
    const modalDestinationLabel = $('#modalDestinationLabel');
    const modalCourier = $('#modalCourier');
    const orderProgressBarContainer = $('#orderProgressBar .progress-bar-container');

    shippingAddressModal.on('show.bs.modal', function(event) {
        const button = $(event.relatedTarget);
        const recipientName = button.data('recipient-name');
        const phoneNumber = button.data('phone-number');
        const address = button.data('address');
        const zipCode = button.data('zip-code');
        const destinationLabel = button.data('destination-label');
        const courier = button.data('courier');
        const currentOrderStatus = button.data('status');

        modalRecipientName.text(recipientName);
        modalPhoneNumber.text('(+62) ' + phoneNumber);
        modalAddress.text(address);
        modalZipCode.text(zipCode);
        modalDestinationLabel.text(destinationLabel);
        modalCourier.text(courier);

        // Bersihkan konten progress bar sebelumnya
        orderProgressBarContainer.empty();

        // Definisikan semua langkah yang mungkin untuk progress bar
        const allPossibleSteps = [
            { id: 'draft', label: 'Waiting for Payment', icon: 'far fa-file-alt' },
            { id: 'pending', label: 'Waiting Payment Confirmed', icon: 'fas fa-hourglass-half' },
            { id: 'paid', label: 'Payment Confirmed', icon: 'fas fa-money-bill-wave' },
            { id: 'process', label: 'Order Shipped', icon: 'fas fa-truck' },
            { id: 'delivered', label: 'Order Completed', icon: 'fas fa-download' },
            { id: 'completed', label: 'Order Accepted', icon: 'fas fa-star' }
        ];
        const currentStatusIndex = allPossibleSteps.findIndex(step => step.id === currentOrderStatus);

        // Bangun progress bar
        allPossibleSteps.forEach((step, index) => {
            const isActive = index <= currentStatusIndex;

            const stepHtml = `
                <div class="progress-step ${isActive ? 'active' : ''}">
                    <div class="step-icon">
                        <i class="${step.icon}"></i>
                    </div>
                    <div class="step-label">${step.label}</div>
                </div>
            `;
            orderProgressBarContainer.append(stepHtml);
        });
        if (currentStatusIndex === -1 && currentOrderStatus) {
            orderProgressBarContainer.append(`<p class="text-muted text-center">Status: ${currentOrderStatus.charAt(0).toUpperCase() + currentOrderStatus.slice(1)}</p>`);
        } else if (!currentOrderStatus) {
             orderProgressBarContainer.append('<p class="text-muted text-center">Status pesanan tidak tersedia.</p>');
        }
    });
}

})(jQuery);