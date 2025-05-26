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
                                                                                        src="{{ url('http://localhost:7777' . $file) }}"
                                                                                        type="video/mp4">
                                                                                    Your browser does not support the video
                                                                                    tag.
                                                                                </video>
                                                                            @else
                                                                                <img src="{{ url('http://localhost:7777' . $file) }}"
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
        let currentProductId = null;

        function fetchChatMessages(productId) {
            fetch(`/getProductMessages/${productId}`)
                .then(response => response.json())
                .then(data => {
                    const chatMessagesContainer = document.getElementById('chatMessages');

                    const isAtBottom =
                        chatMessagesContainer.scrollHeight - chatMessagesContainer.scrollTop <=
                        chatMessagesContainer.clientHeight + 50;

                    chatMessagesContainer.innerHTML = '';

                    if (data.messages && data.messages.length > 0) {
                        data.messages.sort((a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt));

                        data.messages.forEach(message => {
                            const wrapper = document.createElement('div');
                            wrapper.classList.add('d-flex', 'flex-row', 'align-items-start',
                                'mb-2');

                            const isCustomer = message.Role === 'CUSTOMER';
                            wrapper.classList.add(isCustomer ? 'justify-content-end' : 'justify-content-start');

                            // Elemen Avatar
                            const avatarDiv = document.createElement('div');
                            avatarDiv.style.width = '40px';
                            avatarDiv.style.height = '40px';
                            avatarDiv.style.borderRadius = '50%';
                            avatarDiv.style.overflow = 'hidden';
                            avatarDiv.style.flexShrink = '0';

                            let avatarSrc = '';
                            if (isCustomer) {
                                avatarSrc =
                                    'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp';
                            } else {
                                avatarSrc =
                                    'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp';
                            }

                            const avatarImg = document.createElement('img');
                            avatarImg.src = avatarSrc;
                            avatarImg.alt = 'avatar';
                            avatarImg.style.width = '100%';
                            avatarImg.style.height = '100%';
                            avatarImg.style.objectFit = 'cover';
                            avatarDiv.appendChild(avatarImg);


                            const bubbleWrapper = document.createElement('div');
                            if (isCustomer) {
                                bubbleWrapper.classList.add('p-2', 'mb-1', 'rounded-3', 'text-dark');
                            } else {
                                bubbleWrapper.classList.add('p-2', 'mb-1', 'rounded-3', 'text-white');
                            }
                            bubbleWrapper.style.maxWidth = '75%';
                            bubbleWrapper.style.minWidth = 'fit-content';

                            bubbleWrapper.classList.add(isCustomer ? 'bg-light' : 'bg-secondary');

                            const messageText = document.createElement('div');
                            messageText.classList.add('small');
                            messageText.innerText = message.Message;

                            const date = new Date(message.CreatedAt);
                            const timeOnly =
                                `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

                            const timeText = document.createElement('div');
                            if (isCustomer){
                                timeText.classList.add('small', 'text-dark', 'text-end');
                            } else {
                                timeText.classList.add('small', 'text-light', 'text-end');
                            }
                            timeText.style.fontSize = '0.65rem';
                            timeText.style.opacity = '0.8';
                            timeText.innerText = timeOnly;

                            bubbleWrapper.appendChild(messageText);
                            bubbleWrapper.appendChild(timeText);

                            if (isCustomer) {
                                wrapper.style.gap = '8px';
                                wrapper.appendChild(bubbleWrapper);
                                wrapper.appendChild(avatarDiv);
                            } else {
                                wrapper.style.gap = '8px';
                                wrapper.appendChild(avatarDiv);
                                wrapper.appendChild(bubbleWrapper);
                            }

                            chatMessagesContainer.appendChild(wrapper);
                        });

                        if (isAtBottom) {
                            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
                        }
                    } else {
                        chatMessagesContainer.innerHTML = '<p class="text-center text-muted">No messages available</p>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching messages:', error);
                });
        }
        document.querySelectorAll('.product-item').forEach(item => {
            item.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                const productStatus = this.getAttribute('data-product-status');
                const productName = this.getAttribute('data-product-name');
                const productPrice = this.getAttribute('data-product-price');
                const productMedia = this.getAttribute('data-product-image');
                const productMediaType = this.getAttribute('data-product-media-type');

                currentProductId = productId;

                document.getElementById('product-list-panel').style.display = 'none';
                document.getElementById('chat-panel').style.display = 'block';

                document.getElementById('chat-product-name').innerText = productName;
                document.getElementById('productTitle').innerText = productName;
                document.getElementById('productPrice').innerText = productPrice;

                const mediaContainer = document.getElementById('productMediaContainer');
                mediaContainer.innerHTML = '';

                if (productMedia) {
                    const fullUrl = 'http://localhost:7777' + productMedia;

                    if (productMediaType === 'video') {
                        const videoElement = document.createElement('video');
                        videoElement.src = fullUrl;
                        videoElement.alt = 'Product Video';
                        videoElement.autoplay = false;
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
                    const placeholderElement = document.createElement('img');
                    placeholderElement.src =
                        'https://png.pngtree.com/png-vector/20190417/ourmid/pngtree-vector-question-mark-icon-png-image_947159.jpg';
                    placeholderElement.alt = 'No Media Available';
                    placeholderElement.style.cssText =
                        'width: 100%; height: 100%; object-fit: cover; border-radius: 10px;';
                    mediaContainer.appendChild(placeholderElement);
                }

                const chatInput = document.getElementById('chatInput');
                const sendBtn = document.getElementById('sendBtn');

                chatInput.setAttribute('data-product-id', productId);

                if (productStatus === 'rejected') {
                    chatInput.disabled = true;
                    sendBtn.classList.add('disabled');
                    chatInput.placeholder = 'Product rejected, chat disabled.';
                } else if (productStatus === 'delivered') {
                    chatInput.disabled = true;
                    sendBtn.classList.add('disabled');
                    chatInput.placeholder = 'Product completed, chat disabled.';
                } else {
                    chatInput.disabled = false;
                    sendBtn.classList.remove('disabled');
                    chatInput.placeholder = 'Type message';
                }

                fetchChatMessages(productId);
            });
        });
        document.getElementById('back-to-products').addEventListener('click', function() {
            document.getElementById('product-list-panel').style.display = 'block';
            document.getElementById('chat-panel').style.display = 'none';
            currentProductId = null;
        });


        setInterval(() => {
            if (currentProductId) {
                fetchChatMessages(currentProductId);
            }
        }, 3000);
    </script>
    <script>
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');

        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && input.value.trim() !== '') {
                sendMessage();
            }
        });

        sendBtn.addEventListener('click', function() {
            if (input.value.trim() !== '') {
                sendMessage();
            }
        });

        function sendMessage() {
            const message = input.value.trim();
            const productId = input.getAttribute('data-product-id');

            if (!productId) {
                alert('Pilih produk terlebih dahulu.');
                return;
            }

            fetch('/storeMessage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    body: JSON.stringify({
                        product_id: productId,
                        message: message,
                        role: 'CUSTOMER'
                    })
                })
                .then(response => {
                    if (!response.ok) throw new Error('Gagal mengirim pesan');
                    return response.json();
                })
                .then(data => {
                    input.value = '';
                    fetchChatMessages(productId);
                })
                .catch(error => {
                    console.error(error);
                    alert('Terjadi kesalahan saat mengirim pesan.');
                });
        }
    </script>

@stop
