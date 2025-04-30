@extends('layout.master')
@section('container')
    <section class="page-banner bg-image pt-30">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="card" id="chat3" style="border-radius: 15px;">
                        <div class="card-body">
                            <div class="row">
                                <!-- product List Sidebar -->
                                <div class="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0 product-list-border">
                                    <div class="p-3">
                                        <!-- Search Box -->
                                        <div class="input-group rounded mb-3">
                                            <input type="search" class="form-control rounded" placeholder="Search"
                                                aria-label="Search" aria-describedby="search-addon" />
                                            <span class="input-group-text border-0" id="search-addon">
                                                <i class="fas fa-search"></i>
                                            </span>
                                        </div>
                                        <!-- product List -->
                                        <div style="position: relative; height: 500px; overflow-y: auto; padding-right: 5px;"
                                            data-mdb-perfect-scrollbar-init>
                                            <ul class="list-unstyled mb-0">
                                                @if (isset($list) && $list->isNotEmpty())
                                                    @foreach ($list as $product)
                                                        <li class="p-2 product-item border mb-2 rounded"
                                                            data-product-id="{{ $product['ID'] }}">
                                                            <a href="#!" class="d-flex justify-content-between">
                                                                <div class="d-flex flex-row">
                                                                    <div>
                                                                        @if (isset($product['Files'][0]['URL']))
                                                                            <img src="{{ url('http://localhost:7777' . $product['Files'][0]['URL']) }}"
                                                                                alt="avatar"
                                                                                class="d-flex align-self-center me-3"
                                                                                width="70" height="70"
                                                                                style="border-radius: 50%; object-fit: cover;">
                                                                        @else
                                                                            <p class="text-muted">No image available</p>
                                                                        @endif
                                                                        <span class="badge bg-success badge-dot"></span>
                                                                    </div>
                                                                    <div class="pt-1">
                                                                        <p class="fw-bold text-muted mb-0">
                                                                            {{ $product['Name'] }}</p>
                                                                        <p class="small text-muted">
                                                                            Rp. {{ $product['Price'] }}</p>
                                                                    </div>
                                                                </div>
                                                                <div class="pt-1">
                                                                    <p class="small text-muted mb-1">
                                                                        {{ $product['Description'] }}</p>
                                                                </div>
                                                            </a>
                                                        </li>
                                                    @endforeach
                                                @else
                                                    <li class="p-2">
                                                        <p class="text-center text-muted mb-0">No products available</p>
                                                    </li>
                                                @endif
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <!-- Chat Window -->
                                <div class="col-md-6 col-lg-7 col-xl-8">
                                    <!-- Chat Messages -->
                                    <div class="pt-2 pe-2 border rounded"
                                        style="position: relative; height: 500px; background-color: #f8f9fa; border-width: 2px;"
                                        data-mdb-perfect-scrollbar-init>

                                        <div id="chatMessages">
                                            <!-- Chat messages will be inserted here -->
                                        </div>
                                    </div>

                                    <!-- Chat Input -->
                                    <div class="text-muted d-flex justify-content-start align-items-center pe-3 border rounded px-2 py-2 mt-2"
                                        style="border: 1px solid #3b3b3b;">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                            alt="avatar 3" style="width: 40px; height: 100%;">
                                        <input type="text" class="form-control mx-2 border" id="chatInput"
                                            placeholder="Type message" data-product-id=""
                                            style="border: 1px solid #3b3b3b;">
                                        <a class="ms-3 text-muted" href="#!" id="sendBtn">
                                            <i class="fa-solid fa-paper-plane"></i>
                                        </a>
                                    </div>
                                </div>
                                <!-- End Chat Window -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <script>
        let currentProductId = null;

        // Fungsi ambil pesan
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
                            wrapper.classList.add('d-flex', 'flex-row');
                            wrapper.classList.add(message.Role === 'CUSTOMER' ? 'justify-content-end' :
                                'justify-content-start');

                            const bubbleWrapper = document.createElement('div');
                            bubbleWrapper.classList.add('p-2', 'mb-1', 'rounded-3', 'text-white');
                            bubbleWrapper.style.maxWidth = '75%';
                            bubbleWrapper.classList.add(message.Role === 'CUSTOMER' ? 'bg-primary' :
                                'bg-secondary');

                            const messageText = document.createElement('div');
                            messageText.classList.add('small');
                            messageText.innerText = message.Message;

                            const date = new Date(message.CreatedAt);
                            const timeOnly =
                                `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

                            const timeText = document.createElement('div');
                            timeText.classList.add('small', 'text-light', 'text-end', 'mt-1');
                            timeText.innerText = timeOnly;

                            bubbleWrapper.appendChild(messageText);
                            bubbleWrapper.appendChild(timeText);
                            wrapper.appendChild(bubbleWrapper);
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
                currentProductId = productId;

                document.getElementById('chatInput').setAttribute('data-product-id', productId);

                document.querySelectorAll('.product-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');

                fetchChatMessages(productId);
            });
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

        document.querySelectorAll('.product-item').forEach(item => {
            item.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                document.getElementById('chatInput').setAttribute('data-product-id', productId);
            });
        });
    </script>
@stop
