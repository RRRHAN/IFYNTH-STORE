<!-- Modal Fullscreen Media -->
<div class="modal fade" id="fullscreenMediaModal" tabindex="-1" aria-hidden="true"
style="z-index: 1080;">
    <div class="modal-dialog modal-fullscreen modal-dialog-centered">
        <div class="modal-content bg-black">
            <div class="modal-body d-flex justify-content-center align-items-center p-0" id="fullscreenMediaContainer">
                <!-- media element will be injected here -->
            </div>
            <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
    </div>
</div>

<!-- Modal Product Detail -->
<div class="modal fade" id="productDetailModal" tabindex="-1" aria-labelledby="productDetailModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="productDetailModalLabel"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row g-4">
                    <div class="col-lg-5">
                        <div class="image img">
                            <div class="swiper shop-single-slide">
                                <div class="swiper-wrapper" id="modalSwiperMain">
                                    <!-- slides will be inserted here -->
                                </div>
                            </div>
                            <div class="mt-3 swiper shop-slider-thumb">
                                <div class="swiper-wrapper" id="modalSwiperThumb">
                                    <!-- thumbnails inserted here -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-7">
                        <div class="content h24">
                            <h3 class="pb-2 primary-color" id="modalProductName"></h3>
                            <h4 id="modalProductStatus" class="mb-3"></h4>
                            <h2 class="pb-3">
                                <span class="ml-10" id="modalProductPrice"></span>
                            </h2>
                            <h4 class="pb-2 primary-color">Product Description</h4>
                            <p class="product-description text-justify mb-10" id="modalProductDescription"></p>
                        </div>
                        <div class="row">
                            <div class="col-lg-8">
                                <div class="details-area"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- JavaScript -->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const detailButtons = document.querySelectorAll('.view-detail-btn');

        detailButtons.forEach(button => {
            button.addEventListener('click', function() {
                const name = this.getAttribute('data-name') || '-';
                const price = this.getAttribute('data-price') || '0';
                const status = this.getAttribute('data-status') || 'pending';
                const description = this.getAttribute('data-description') || '-';
                const imagesData = this.getAttribute('data-images');
                const images = imagesData ? JSON.parse(imagesData) : [];

                // Set Text
                document.getElementById('modalProductName').textContent = name;
                document.getElementById('modalProductStatus').textContent = status;
                document.getElementById('modalProductPrice').textContent = 'Rp ' + price;
                document.getElementById('modalProductDescription').innerHTML = description
                    .replace(/\n/g, '<br>');

                // Isi Swiper Main
                const mainSwiper = document.getElementById('modalSwiperMain');
                mainSwiper.innerHTML = '';

                images.forEach(url => {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';

                    if (/\.(mp4|webm|ogg)$/i.test(url)) {
                        slide.innerHTML = `
                            <video controls style="width: 100%; max-height: 400px; cursor: pointer;">
                                <source src="${url}" type="video/mp4">
                                Browser Anda tidak mendukung tag video.
                            </video>`;
                    } else {
                        slide.innerHTML =
                            `<img src="${url}" alt="${name}" style="width: 100%; max-height: 400px; object-fit: cover; cursor: pointer;">`;
                    }

                    mainSwiper.appendChild(slide);
                });

                // Isi Swiper Thumb
                const thumbSwiper = document.getElementById('modalSwiperThumb');
                thumbSwiper.innerHTML = '';

                images.forEach(url => {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide slide-smoll';

                    if (/\.(mp4|webm|ogg)$/i.test(url)) {
                        slide.innerHTML = `
                            <video muted style="width: 100%; height: 100px; object-fit: cover;">
                                <source src="${url}" type="video/mp4">
                            </video>`;
                    } else {
                        slide.innerHTML =
                            `<img src="${url}" alt="${name}" style="width: 100%; height: 100px; object-fit: cover;">`;
                    }

                    thumbSwiper.appendChild(slide);
                });

                // Reinitialize Swiper
                setTimeout(() => {
                    if (window.shopSingleSlide) window.shopSingleSlide.destroy(true,
                        true);
                    if (window.shopSliderThumb) window.shopSliderThumb.destroy(true,
                        true);

                    window.shopSliderThumb = new Swiper(".shop-slider-thumb", {
                        slidesPerView: 4,
                        spaceBetween: 10,
                        freeMode: true,
                        watchSlidesProgress: true,
                    });

                    window.shopSingleSlide = new Swiper(".shop-single-slide", {
                        spaceBetween: 10,
                        thumbs: {
                            swiper: window.shopSliderThumb,
                        },
                    });

                    // Tambahkan klik event ke gambar/video
                    mainSwiper.querySelectorAll('img, video').forEach(el => {
                        el.addEventListener('click', () => openFullscreenMedia(
                            el.src));
                    });

                }, 100);
            });
        });
    });

function openFullscreenMedia(url) {
    const container = document.getElementById('fullscreenMediaContainer');
    container.innerHTML = ''; 

    let mediaElement;

    if (/\.(mp4|webm|ogg)$/i.test(url)) {
        mediaElement = document.createElement('video');
        mediaElement.src = url;
        mediaElement.controls = true;
        mediaElement.autoplay = true;
        mediaElement.style.width = '100%';
        mediaElement.style.maxHeight = '100vh';
        mediaElement.style.objectFit = 'contain';

        // Menambahkan video ke dalam container tanpa modal fullscreen
        container.appendChild(mediaElement);
    } else {

        mediaElement = document.createElement('img');
        mediaElement.src = url;
        mediaElement.alt = 'Fullscreen Media';
        mediaElement.style.maxWidth = '100%';
        mediaElement.style.maxHeight = '100vh';
        mediaElement.style.objectFit = 'contain';

        mediaElement.addEventListener('click', function () {
            if (mediaElement.requestFullscreen) {
                mediaElement.requestFullscreen();
            } else if (mediaElement.mozRequestFullScreen) { 
                mediaElement.mozRequestFullScreen();
            } else if (mediaElement.webkitRequestFullscreen) {
                mediaElement.webkitRequestFullscreen();
            } else if (mediaElement.msRequestFullscreen) {
                mediaElement.msRequestFullscreen();
            }
        });

        const fullscreenModal = new bootstrap.Modal(document.getElementById('fullscreenMediaModal'));
        container.appendChild(mediaElement);
        fullscreenModal.show();
    }
}

</script>
