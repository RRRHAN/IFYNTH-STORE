<div class="modal fade" id="productDetailModal" tabindex="-1" aria-labelledby="productDetailModalLabel" aria-hidden="true">
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
                                <div class="details-area">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
</div>
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

                // Isi Gambar
                const mainSwiper = document.getElementById('modalSwiperMain');
                mainSwiper.innerHTML = '';

                images.forEach(url => {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    slide.innerHTML = `<img src="${url}" alt="${name}">`;
                    mainSwiper.appendChild(slide);
                });

                const thumbSwiper = document.getElementById('modalSwiperThumb');
                thumbSwiper.innerHTML = '';

                images.forEach(url => {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide slide-smoll';
                    slide.innerHTML = `<img src="${url}" alt="${name}">`;
                    thumbSwiper.appendChild(slide);
                });

                // Reinitialize Swiper
                setTimeout(() => {
                    if (window.shopSingleSlide) shopSingleSlide.destroy(true, true);
                    if (window.shopSliderThumb) shopSliderThumb.destroy(true, true);

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
                }, 100);
            });
        });
    });
</script>