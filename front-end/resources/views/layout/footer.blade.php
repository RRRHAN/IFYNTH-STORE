    <!-- Footer area start here -->
    <footer class="footer-area bg-image" data-background="">
        <div class="container">
            <div class="footer__wrp pt-65 pb-65 bor-top bor-bottom">
                <div class="row g-4">
                    <div class="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-duration="1.1s" data-wow-delay=".1s">
                        <div class="footer__item">
                            <h4 class="footer-title">Customer Service</h4>
                            <ul>
                                <li><a href="contact.html"><span></span>Help Portal</a></li>
                                <li><a href="contact.html"><span></span>Contact Us</a></li>
                                <li><a href=""><span></span>Delivery Information</a></li>
                                <li><a href=""><span></span>Click and Collect</a></li>
                                <li><a href=""><span></span>Refunds and Returns</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-duration="1.2s" data-wow-delay=".2s">
                        <div class="footer__item">
                            <h4 class="footer-title">Get to Know Us</h4>
                            <ul>
                                <li><a href="{{route('products.getAll', ['department' => 'IFY'])}}"><span></span>I Found You</a></li>
                                <li><a href="{{route('products.getAll', ['department' => 'NTH'])}}"><span></span>No Time To Hell</a></li>
                                <li><a href="/sellproduct"><span></span>Sell Your Clothes</a></li>
                                <li><a href=""><span></span>Contact Us</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-duration="1.3s" data-wow-delay=".3s">
                        <div class="footer__item">
                            <h4 class="footer-title">IFYNTH new collections</h4>
                            <ul>
                                <li><a href="{{route('products.getAll', ['category' => 'Shirt'])}}"><span></span>Shirt</a></li>
                                <li><a href="{{route('products.getAll', ['category' => 'T-Shirt'])}}"><span></span>T-Shirt</a></li>
                                <li><a href="{{route('products.getAll', ['category' => 'Long Shirt'])}}"><span></span>Long Shirt</a></li>
                                <li><a href="{{route('products.getAll', ['category' => 'Outerwear'])}}"><span></span>Outerwear</a></li>
                                <li><a href="{{route('products.getAll', ['category' => 'Pants'])}}"><span></span>Pants</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-duration="1.4s" data-wow-delay=".4s">
                        <div class="footer__item newsletter">
                            <h4 class="footer-title">get newsletter</h4>
                            <div class="subscribe">
                                <input type="email" placeholder="Your Email">
                                <button><i class="fa-solid fa-paper-plane"></i></button>
                            </div>
                            <div class="social-icon mt-40">
                                <a href=""><i class="fa-brands fa-facebook-f"></i></a>
                                <a href=""><i class="fa-brands fa-twitter"></i></a>
                                <a href=""><i class="fa-brands fa-linkedin-in"></i></a>
                                <a href=""><i class="fa-brands fa-youtube"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <!-- Footer area end here -->

    <!-- Back to top area start here -->
    <div class="scroll-up">
        <svg class="scroll-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
            <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
        </svg>
    </div>
    <!-- Back to top area end here -->