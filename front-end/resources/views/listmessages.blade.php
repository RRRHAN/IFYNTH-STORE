@extends('layout.master')
@section('container')
    <section class="page-banner bg-image pt-30">
        <div class="container" style="padding-bottom: 10%">
            <div class="row">
                <div class="col-md-12">
                    <div class="card sub-bg" id="chat3" style="border-radius: 15px;">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-12" id="product-list-panel">
                                    <div class="p-3">
                                        <div class="input-group rounded mb-3 text-white">
                                            <input type="search" class="form-control custom-search-input"
                                                placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
                                            <span class="input-group-text border-0 custom-search-addon" id="search-addon">
                                                <i class="fas fa-search"></i>
                                            </span>
                                        </div>
                                        <div style="position: relative; height: 600px; overflow-y: auto; padding-right: 5px;"
                                            data-mdb-perfect-scrollbar-init>
                                            <ul class="list-unstyled mb-0">
                                                @if (isset($list) && $list->isNotEmpty())
                                                    @foreach ($list as $product)
                                                        @php
                                                            $file = $product['Files'][0]['URL'] ?? null;
                                                            $isVideo =
                                                                $file && preg_match('/\.(mp4|webm|ogg)$/i', $file);
                                                        @endphp
                                                        <li class="p-2 product-item border mb-2 rounded"
                                                            data-product-id="{{ $product['ID'] }}"
                                                            data-product-status="{{ $product['Status'] }}"
                                                            data-product-name="{{ $product['Name'] }}"
                                                            data-product-price="Rp. {{ number_format($product['Price'] ?? 0, 0, ',', '.') }}"
                                                            data-product-image={{ $product['Files'][0]['URL'] }}
                                                            data-product-media-type="{{ $isVideo ? 'video' : 'image' }}">
                                                            <a href="#!" class="d-flex justify-content-between">
                                                                <div class="d-flex flex-row">
                                                                    <div>
                                                                        @if ($file)
                                                                            @if ($isVideo)
                                                                                <video alt="avatar"
                                                                                    class="d-flex align-self-center me-3"
                                                                                    width="70" height="70"
                                                                                    style="border-radius: 50%; object-fit: cover;"
                                                                                    muted preload="metadata">
                                                                                    <source
                                                                                        src="{{ url(config('app.back_end_base_url') . '/api' . $file) }}"
                                                                                        type="video/mp4">
                                                                                    Your browser does not support the video
                                                                                    tag.
                                                                                </video>
                                                                            @else
                                                                                <img src="{{ url(config('app.back_end_base_url') . '/api' . $file) }}"
                                                                                    alt="avatar"
                                                                                    class="d-flex align-self-center me-3"
                                                                                    width="70" height="70"
                                                                                    style="border-radius: 50%; object-fit: cover;">
                                                                            @endif
                                                                        @else
                                                                            <p>No image available</p>
                                                                        @endif
                                                                        <span class="badge bg-success badge-dot"></span>
                                                                    </div>
                                                                    <div class="pt-1">
                                                                        <h4 class="mb-0 text-capitalize">
                                                                            {{ $product['Name'] }}</h4>
                                                                        <p class="small">
                                                                            Rp. {{ number_format($product['Price'] ?? 0) }}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div class="pt-1">
                                                                    <p class="small mb-1">
                                                                        {{ $product['Status'] }}</p>
                                                                </div>
                                                            </a>
                                                        </li>
                                                    @endforeach
                                                @else
                                                    <li class="p-2">
                                                        <p class="text-center text-capitalize mb-0">No products available
                                                        </p>
                                                    </li>
                                                @endif
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-12" id="chat-panel" style="display: none;">
                                    <div class="d-flex align-items-center mb-3">
                                        <button class="text-white" id="back-to-products">
                                            <i class="fas fa-arrow-left me-2"></i> Back to Product List
                                        </button>
                                        <h5 class="d-none" id="chat-product-name"></h5>
                                    </div>
                                    <div class="pt-2 pe-2 border rounded"
                                        style="position: relative; height: 600px; background-color: #262626; border-width: 2px;"
                                        data-mdb-perfect-scrollbar-init>
                                        <!-- PRODUCT INFO -->
                                        <div id="productInfo"
                                            class="mb-3 d-flex align-items-center justify-content-center p-2 rounded">
                                            <div id="productMediaContainer"
                                                style="width: 60px; height: 60px; border-radius: 10px; margin-right: 10px; overflow: hidden; flex-shrink: 0;">
                                            </div>
                                            <div>
                                                <h4 id="productTitle" class="mb-0 text-capitalize"></h4>
                                                <p id="productPrice" class="text-white"></p>
                                            </div>
                                        </div>
                                        <div id="chatMessages">
                                        </div>
                                    </div>

                                    <div class="text-muted d-flex justify-content-start align-items-center pe-3 border rounded px-2 py-2 mt-2"
                                        style="border: 1px solid #3b3b3b;">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                            alt="avatar 3"
                                            style="width: 40px; height: 100%; border-radius: 50%; object-fit: cover;">

                                        <input type="text" class="form-control mx-2 border" id="chatInput"
                                            placeholder="Type message" data-product-id=""
                                            style="border: 1px solid #3b3b3b;">

                                        <a class="ms-3 text-white" href="#!" id="sendBtn">
                                            <i class="fa-solid fa-paper-plane"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            let currentProductId = null;

            // Pastikan URL base backend tercetak ke JavaScript dari konfigurasi Laravel
            const BACKEND_BASE_URL = '{{ config('app.back_end_base_url') }}';
            const CSRF_TOKEN = '{{ csrf_token() }}';

            /**
             * Mengambil dan menampilkan pesan chat untuk suatu produk.
             * @param {string} productId - ID produk.
             */
            function fetchChatMessages(productId) {
                fetch(`/getProductMessages/${productId}`)
                    .then(response => {
                        if (!response.ok) {
                            // Jika respons bukan OK, throw error dengan status
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        const chatMessagesContainer = document.getElementById('chatMessages');
                        // Pastikan kontainer pesan ditemukan
                        if (!chatMessagesContainer) {
                            console.error('Error: Chat messages container (ID: chatMessages) not found!');
                            return;
                        }

                        const isAtBottom = chatMessagesContainer.scrollHeight - chatMessagesContainer
                            .scrollTop <=
                            chatMessagesContainer.clientHeight + 50; 

                        chatMessagesContainer.innerHTML = '';

                        // Jika ada pesan, tampilkan
                        if (data.messages && data.messages.length > 0) {
                            // Urutkan pesan berdasarkan tanggal dibuat
                            data.messages.sort((a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt));

                            data.messages.forEach(message => {
                                const wrapper = document.createElement('div');
                                wrapper.classList.add('d-flex', 'flex-row', 'align-items-start',
                                'mb-2');

                                const isCustomer = message.Role === 'CUSTOMER';
                                // Atur posisi pesan (kanan untuk customer, kiri untuk lainnya)
                                wrapper.classList.add(isCustomer ? 'justify-content-end' :
                                    'justify-content-start');

                                // Elemen Avatar
                                const avatarDiv = document.createElement('div');
                                avatarDiv.style.width = '40px';
                                avatarDiv.style.height = '40px';
                                avatarDiv.style.borderRadius = '50%';
                                avatarDiv.style.overflow = 'hidden';
                                avatarDiv.style.flexShrink = '0'; // Mencegah avatar menyusut

                                // Tentukan sumber avatar berdasarkan role
                                let avatarSrc = isCustomer ?
                                    'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp' :
                                    'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp';

                                const avatarImg = document.createElement('img');
                                avatarImg.src = avatarSrc;
                                avatarImg.alt = 'avatar';
                                avatarImg.style.cssText =
                                    'width: 100%; height: 100%; object-fit: cover;'; // Inline style untuk gambar
                                avatarDiv.appendChild(avatarImg);

                                // Wrapper untuk bubble pesan
                                const bubbleWrapper = document.createElement('div');
                                bubbleWrapper.classList.add('p-2', 'mb-1', 'rounded-3');
                                bubbleWrapper.style.maxWidth = '75%'; // Batasi lebar bubble
                                bubbleWrapper.style.minWidth = 'fit-content'; // Sesuaikan lebar minimum
                                // Atur background bubble berdasarkan role
                                bubbleWrapper.classList.add(isCustomer ? 'bg-light' : 'bg-secondary');

                                // Teks pesan
                                const messageText = document.createElement('div');
                                messageText.classList.add('small');
                                messageText.innerText = message.Message;
                                // Atur warna teks pesan
                                messageText.classList.add(isCustomer ? 'text-dark' : 'text-white');

                                // Waktu pesan
                                const date = new Date(message.CreatedAt);
                                const timeOnly =
                                    `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

                                const timeText = document.createElement('div');
                                timeText.classList.add('small', 'text-end'); // Rata kanan untuk waktu
                                timeText.style.fontSize = '0.65rem'; // Ukuran font lebih kecil
                                timeText.style.opacity = '0.8'; // Sedikit transparan
                                timeText.innerText = timeOnly;
                                // Atur warna teks waktu
                                timeText.classList.add(isCustomer ? 'text-dark' : 'text-light');

                                // Gabungkan teks pesan dan waktu ke dalam bubble
                                bubbleWrapper.appendChild(messageText);
                                bubbleWrapper.appendChild(timeText);

                                // Gabungkan avatar dan bubble ke wrapper pesan
                                wrapper.style.gap = '8px'; // Jarak antara avatar dan bubble
                                if (isCustomer) {
                                    wrapper.appendChild(bubbleWrapper);
                                    wrapper.appendChild(avatarDiv);
                                } else {
                                    wrapper.appendChild(avatarDiv);
                                    wrapper.appendChild(bubbleWrapper);
                                }

                                chatMessagesContainer.appendChild(wrapper);
                            });

                            // Scroll ke bawah jika sebelumnya sudah di paling bawah
                            if (isAtBottom) {
                                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
                            }
                        } else {
                            // Tampilkan pesan jika tidak ada chat
                            chatMessagesContainer.innerHTML =
                                '<p class="text-center text-muted">No messages available</p>';
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching messages:', error);
                        // Opsi: Tampilkan pesan error ke pengguna
                        const chatMessagesContainer = document.getElementById('chatMessages');
                        if (chatMessagesContainer) {
                            chatMessagesContainer.innerHTML =
                                `<p class="text-center text-danger">Failed to load messages: ${error.message}</p>`;
                        }
                    });
            }

            /**
             * Mengirim pesan chat baru.
             */
            function sendMessage() {
                const chatInput = document.getElementById('chatInput');
                // Pastikan input chat ditemukan
                if (!chatInput) {
                    console.error('Error: Chat input (ID: chatInput) not found!');
                    return;
                }

                const message = chatInput.value.trim();
                const productId = chatInput.getAttribute('data-product-id');

                // Validasi input
                if (!productId) {
                    alert('Pilih produk terlebih dahulu.');
                    return;
                }
                if (message === '') {
                    // Tidak mengirim pesan kosong
                    return;
                }
                if (chatInput.disabled) { // Jangan kirim jika input disabled
                    console.warn('Chat input is disabled.');
                    return;
                }

                fetch('/storeMessage', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': CSRF_TOKEN
                        },
                        body: JSON.stringify({
                            product_id: productId,
                            message: message,
                            role: 'CUSTOMER'
                        })
                    })
                    .then(response => {
                        if (!response.ok) {
                            // Jika respons bukan OK, coba parse JSON error atau throw error generik
                            return response.json().then(err => {
                                throw new Error(err.message ||
                                    `Failed to send message: ${response.status}`);
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        chatInput.value = '';
                        fetchChatMessages(productId);
                    })
                    .catch(error => {
                        console.error('Error sending message:', error);
                        alert('Terjadi kesalahan saat mengirim pesan: ' + error.message);
                    });
            }

            // --- Event Listeners setelah DOM siap ---

            // 1. Event listener untuk setiap item produk (saat mengklik item produk)
            document.querySelectorAll('.product-item').forEach(item => {
                item.addEventListener('click', function(event) {
                    event
                .preventDefault();


                    // Ambil data dari atribut data-*
                    const productId = this.getAttribute('data-product-id');
                    const productStatus = this.getAttribute('data-product-status');
                    const productName = this.getAttribute('data-product-name');
                    const productPrice = this.getAttribute('data-product-price');
                    const productMedia = this.getAttribute('data-product-image');
                    const productMediaType = this.getAttribute('data-product-media-type');

                    currentProductId = productId;

                    // Dapatkan referensi ke panel-panel
                    const productListPanel = document.getElementById('product-list-panel');
                    const chatPanel = document.getElementById('chat-panel');

                    // Sembunyikan daftar produk, tampilkan panel chat
                    if (productListPanel) productListPanel.style.display = 'none';
                    if (chatPanel) chatPanel.style.display = 'block';

                    // Update informasi produk di panel chat
                    const chatProductName = document.getElementById('chat-product-name');
                    const productTitle = document.getElementById('productTitle');
                    const productPriceEl = document.getElementById('productPrice');

                    if (chatProductName) chatProductName.innerText = productName;
                    if (productTitle) productTitle.innerText = productName;
                    if (productPriceEl) productPriceEl.innerText = productPrice;

                    // Tampilkan media produk (gambar/video)
                    const mediaContainer = document.getElementById('productMediaContainer');
                    if (mediaContainer) {
                        mediaContainer.innerHTML = '';

                        if (productMedia) {
                            const fullUrl = BACKEND_BASE_URL + '/api' +
                            productMedia;

                            if (productMediaType === 'video') {
                                const videoElement = document.createElement('video');
                                videoElement.src = fullUrl;
                                videoElement.alt = 'Product Video';
                                videoElement.autoplay =
                                false;
                                videoElement.loop = false;
                                videoElement.muted = true;
                                videoElement.preload = 'metadata';
                                videoElement.style.cssText =
                                    'width: 100%; height: 100%; object-fit: cover; border-radius: 10px;';
                                mediaContainer.appendChild(videoElement);
                            } else {
                                const imgElement = document.createElement('img');
                                imgElement.src = fullUrl;
                                imgElement.alt = 'Product Image';
                                imgElement.style.cssText =
                                    'width: 100%; height: 100%; object-fit: cover; border-radius: 10px;';
                                mediaContainer.appendChild(imgElement);
                            }
                        } else {
                            // Placeholder jika tidak ada media
                            const placeholderElement = document.createElement('img');
                            placeholderElement.src =
                                'https://png.pngtree.com/png-vector/20190417/ourmid/pngtree-vector-question-mark-icon-png-image_947159.jpg';
                            placeholderElement.alt = 'No Media Available';
                            placeholderElement.style.cssText =
                                'width: 100%; height: 100%; object-fit: cover; border-radius: 10px;';
                            mediaContainer.appendChild(placeholderElement);
                        }
                    }

                    // Atur status input chat berdasarkan status produk
                    const chatInput = document.getElementById('chatInput');
                    const sendBtn = document.getElementById('sendBtn');

                    if (chatInput) chatInput.setAttribute('data-product-id',
                    productId);

                    if (productStatus === 'rejected') {
                        if (chatInput) {
                            chatInput.disabled = true;
                            chatInput.placeholder = 'Product rejected, chat disabled.';
                        }
                        if (sendBtn) sendBtn.classList.add('disabled');
                    } else if (productStatus === 'delivered') {
                        if (chatInput) {
                            chatInput.disabled = true;
                            chatInput.placeholder = 'Product completed, chat disabled.';
                        }
                        if (sendBtn) sendBtn.classList.add('disabled');
                    } else {
                        if (chatInput) {
                            chatInput.disabled = false;
                            chatInput.placeholder = 'Type message';
                        }
                        if (sendBtn) sendBtn.classList.remove('disabled');
                    }

                    fetchChatMessages(productId);
                });
            });

            // 2. Event listener untuk tombol 'Back to Product List'
            const backToProductsBtn = document.getElementById('back-to-products');
            if (backToProductsBtn) {
                backToProductsBtn.addEventListener('click', function() {
                    const productListPanel = document.getElementById('product-list-panel');
                    const chatPanel = document.getElementById('chat-panel');
                    if (productListPanel) productListPanel.style.display = 'block';
                    if (chatPanel) chatPanel.style.display = 'none';
                    currentProductId = null;
                });
            }

            // 3. Event listener untuk mengirim pesan via Enter di input chat
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter' && chatInput.value.trim() !== '' && !chatInput.disabled) {
                        sendMessage();
                    }
                });
            }

            // 4. Event listener untuk mengirim pesan via tombol 'Send'
            const sendBtn = document.getElementById('sendBtn');
            if (sendBtn) {
                sendBtn.addEventListener('click', function() {
                    if (chatInput && chatInput.value.trim() !== '' && !chatInput.disabled) {
                        sendMessage();
                    }
                });
            }

            setInterval(() => {
                if (currentProductId) {
                    fetchChatMessages(currentProductId);
                }
            }, 3000);
        });
    </script>
@stop
