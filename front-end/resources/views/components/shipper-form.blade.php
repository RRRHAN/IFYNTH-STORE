<meta name="csrf-token" content="{{ csrf_token() }}">
<div id="shipperForm" class="shipper-form mt-2" style="display: none;">
    <form id="formShip" action="/checkout" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="mb-3">
            <label for="name" class="form-label">Full Name</label>
            <input type="text" class="form-control" id="name" name="name"
                value="{{ session('user')['Name'] ?? 'Enter your Full Name' }}" required>
        </div>
        <div class="mb-3">
            <label for="phone" class="form-label">Phone Number</label>
            <input type="text" class="form-control" id="phone" name="phone_number"
                value="{{ session('user')['PhoneNumber'] ?? 'Enter your Phone Number' }}" required>
        </div>
        <div class="mb-3">
            <label for="address" class="form-label">Shipping Address</label>
            <textarea class="form-control" id="address" name="address" rows="3" required>{{ session('user')['CustomerDetails']['Address'] ?? '' }}</textarea>
        </div>
        <div class="mb-3 row">
            <div class="col-md-8">
                <label for="searchDestination" class="form-label">Search Destination (Kota, Distrik, Kecamatan / Kode
                    Pos)</label>
                <input type="text" class="form-control" id="searchDestination" placeholder="e.g., Surabaya"
                    autocomplete="off" name="destination_label"
                    value="{{ session('user')['CustomerDetails']['DestinationLabel'] ?? '' }}">
                <input type="hidden" id="destination_id"
                    value="{{ session('user')['CustomerDetails']['DestinationID'] ?? '' }}">
                <ul id="suggestions" class="list-group position-absolute w-50 mt-1"
                    style="z-index: 1000; max-height: 200px; overflow-y: auto;"></ul>
            </div>
            <div class="col-md-4">
                <label for="zip_code" class="form-label">Zip Code</label>
                <input type="text" class="form-control" id="zip_code" name="zip_code" maxlength="5"
                    inputmode="numeric" pattern="\d{5}" oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                    value="{{ session('user')['CustomerDetails']['ZipCode'] ?? '' }}">
            </div>
        </div>
        <div id="shippingTariff" class="mb-3" style="display: none;">
            <label for="tariff" class="form-label">Courir</label>
            <select class="form-control" id="tariff">
                <option value="">Courir</option>
            </select>
            <input type="text" id="courierInput" name="courir" hidden>
            <input type="hidden" id="shipping_cost" name="shipping_cost">
            <input type="hidden" id="grandtotal">
        </div>
        <div id="uploadProofContainer" class="mb-3" style="display: none;">
            <h5>Bank Transfer :</h5>
            <h5>BCA 1702321312 a/n Razzan</h5>
            <label for="transfer_proof" class="form-label">
                Upload Bukti Transfer</label>
            <input type="file" class="form-control" id="transfer_proof" name="payment_proof" accept="image/*"
                required>
        </div>
    </form>
</div>
<script>
    document.getElementById("transfer_proof").addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            alert("Only image files are allowed!");
            e.target.value = "";
        }
    });
</script>
<script>
    // Ambil elemen penting
    const searchInput = document.getElementById('searchDestination');
    const zipCodeInput = document.getElementById('zip_code');
    const suggestionBox = document.getElementById('suggestions');
    const tariffDropdown = document.getElementById('tariff');
    const shippingTariffDiv = document.getElementById('shippingTariff');
    const shippingCostInput = document.getElementById('shipping_cost');
    const grandTotalInput = document.getElementById('grandtotal');

    let debounceTimer;

    // Fungsi render option tarif pengiriman
    function renderTariffOptions(data) {
        tariffDropdown.innerHTML = '<option value="">Select a Courier</option>';
        const tarifList = [];

        if (data.data) {
            const {
                calculate_reguler = [], calculate_cargo = []
            } = data.data;

            calculate_reguler.forEach((item, index) => {
                tarifList.push({
                    ...item,
                    type: 'Reguler',
                    index
                });
            });

            calculate_cargo.forEach((item, index) => {
                tarifList.push({
                    ...item,
                    type: 'Cargo',
                    index
                });
            });
        }

        if (tarifList.length > 0) {
            shippingTariffDiv.style.display = 'block';
            tarifList.forEach(item => {
                const option = document.createElement('option');
                option.value = `${item.shipping_name}-${item.service_name}-${item.type}-${item.index}`;
                option.textContent =
                    `${item.shipping_name} ${item.service_name} (${item.type}) - Rp${item.shipping_cost.toLocaleString()} - ETA: ${item.etd}`;
                option.dataset.shipping = JSON.stringify(item);
                tariffDropdown.appendChild(option);
            });
        } else {
            shippingTariffDiv.style.display = 'none';
        }
    }

    // Event input pencarian lokasi
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        clearTimeout(debounceTimer);

        if (query.length < 3) {
            suggestionBox.innerHTML = '';
            return;
        }

        debounceTimer = setTimeout(() => {
            fetch(`/search-destination?q=${encodeURIComponent(query)}&limit=5&offset=0`)
                .then(res => res.json())
                .then(data => {
                    suggestionBox.innerHTML = '';

                    if (data.data && data.data.length > 0) {
                        data.data.forEach(item => {
                            const li = document.createElement('li');
                            li.className = 'list-group-item list-group-item-action';
                            li.textContent =
                                `${item.subdistrict_name}, ${item.district_name}, ${item.city_name}, ${item.province_name}`;
                            li.dataset.zip = item.zip_code || '';
                            li.dataset.id = item.id;

                            li.addEventListener('click', e => {
                                e.stopPropagation();
                                searchInput.value = li.textContent;
                                zipCodeInput.value = li.dataset.zip;
                                document.getElementById('destination_id').value = li
                                    .dataset.id;
                                suggestionBox.innerHTML = '';

                                // Ambil data berat dan nilai item dari server-side blade (atau data JS lain)
                                const weight = parseFloat(
                                    "{{ isset($cartItems['TotalWeight']) ? number_format($cartItems['TotalWeight'] / 1000, 2, '.', '') : 0 }}"
                                );
                                const itemValue =
                                    {{ isset($cartItems['TotalPrice']) ? $cartItems['TotalPrice'] : 0 }};

                                if (!weight || !itemValue) {
                                    console.error("Missing weight or item value!");
                                    return;
                                }

                                fetch('/check-tariff', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'X-CSRF-TOKEN': document
                                                .querySelector(
                                                    'meta[name="csrf-token"]')
                                                .getAttribute('content')
                                        },
                                        body: JSON.stringify({
                                            receiver_destination_id: li
                                                .dataset.id,
                                            weight: weight,
                                            item_value: itemValue
                                        })
                                    })
                                    .then(response => response.json())
                                    .then(data => {
                                        renderTariffOptions(data);
                                    })
                                    .catch(error => {
                                        console.error(
                                            'Error fetching shipping cost:',
                                            error);
                                    });
                            });

                            suggestionBox.appendChild(li);
                        });
                    } else {
                        const li = document.createElement('li');
                        li.className = 'list-group-item disabled';
                        li.textContent = 'No results found';
                        suggestionBox.appendChild(li);
                    }
                })
                .catch(err => {
                    console.error('Fetch error:', err);
                    suggestionBox.innerHTML =
                        '<li class="list-group-item disabled">Error loading</li>';
                });
        }, 200);
    });

    // Auto-fetch tarif jika destination_id sudah ada saat halaman load
    document.addEventListener('DOMContentLoaded', () => {
        const destinationId = document.getElementById('destination_id').value.trim();

        if (destinationId) {
            const weight = parseFloat(
                "{{ isset($cartItems['TotalWeight']) ? number_format($cartItems['TotalWeight'] / 1000, 2, '.', '') : 0 }}"
            );
            const itemValue = {{ isset($cartItems['TotalPrice']) ? $cartItems['TotalPrice'] : 0 }};

            if (!weight || !itemValue) {
                console.error("Missing weight or item value!");
                return;
            }

            fetch('/check-tariff', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute(
                            'content')
                    },
                    body: JSON.stringify({
                        receiver_destination_id: destinationId,
                        weight: weight,
                        item_value: itemValue
                    })
                })
                .then(response => response.json())
                .then(data => {
                    renderTariffOptions(data);
                })
                .catch(error => {
                    console.error('Error auto-fetching shipping cost:', error);
                });
        }
    });

    // Event pilihan tarif pengiriman berubah
    tariffDropdown.addEventListener('change', () => {
        const selectedOption = tariffDropdown.options[tariffDropdown.selectedIndex];
        if (selectedOption && selectedOption.dataset.shipping) {
            const shippingData = JSON.parse(selectedOption.dataset.shipping);
            const shippingCost = shippingData.shipping_cost || 0;
            const grandTotal = shippingData.grandtotal || 0;
            const courier = (shippingData.shipping_name + '-' + shippingData.service_name + '-(' + shippingData.type + ')') || '';
            console.log(shippingData);


            shippingCostInput.value = shippingCost;
            grandTotalInput.value = grandTotal;

            // Tampilkan biaya pengiriman dan grand total
            document.getElementById('courierInput').value = courier;
            document.getElementById('shippingCostAmount').textContent = `Rp.${shippingCost.toLocaleString()}`;
            document.getElementById('shippingCostDisplay').style.display = 'block';

            document.getElementById('grandTotalAmount').textContent = `Rp.${grandTotal.toLocaleString()}`;
            document.getElementById('grandTotalDisplay').style.display = 'block';

            document.getElementById('uploadProofContainer').style.display = 'block';

            console.log('Selected Shipping Cost:', shippingCost);
        }
    });

    // Tutup suggestion box jika klik di luar area pencarian
    document.addEventListener('click', e => {
        if (!searchInput.contains(e.target) && !suggestionBox.contains(e.target)) {
            suggestionBox.innerHTML = '';
        }
    });
</script>
