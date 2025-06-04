<meta name="csrf-token" content="{{ csrf_token() }}">
@include('components.addressModal')
<div id="shipperForm" class="shipper-form mt-2" style="display: none; margin-left: 25px; margin-right: 25px;">
    <form id="formShip" action="/checkout" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="mb-3">
            <label for="selectAddress" class="form-label">Select Shipping Address</label>
            <select class="form-control" id="selectAddress" name="selected_address_id" required
                {{ $addresses->isEmpty() ? 'disabled' : '' }}>
                <option value="">
                    {{ $addresses->isEmpty() ? 'No addresses available. Please add one first.' : '-- Select an existing address --' }}
                </option>
                @forelse ($addresses as $address)
                    <option value="{{ $address['ID'] }}" data-address="{{ json_encode($address) }}">
                        {{ $address['RecipientsName'] ?? 'Name not available' }} (+62)
                        {{ $address['RecipientsNumber'] ?? 'Number not available' }} -
                        {{ $address['Address'] ?? '' }},
                        {{ $address['DestinationLabel'] ?? '' }},
                        {{ $address['ZipCode'] ?? '' }}
                    </option>
                @empty
                    <option value="" disabled>No addresses available. Please add one first.</option>
                @endforelse
            </select>
        </div>
        {{-- Hidden fields for checkout --}}
        <input type="hidden" id="courierIndex" name="courierIndex">
        <input type="hidden" id="addressId" name="addressId">

        <div id="shippingTariff" class="mb-3" style="display: none;">
            <label for="tariff" class="form-label">Courier</label>
            <select class="form-control" id="tariff">
                <option value="">Courier</option>
            </select>
            <input type="hidden" id="courierInput" name="courir">
            <input type="hidden" id="shipping_cost" name="shipping_cost">
            <input type="hidden" id="grandtotal">
        </div>
    </form>
    @if ($addresses->isEmpty())
        <button class="btn btn-secondary mb-3" data-bs-toggle="modal" data-bs-target="#addAddressModal">
            <i class="fas fa-plus me-2"></i> Add New Address
        </button>
    @endif
</div>
<script>
    const selectAddressDropdown = document.getElementById('selectAddress');
    // Variabel input yang tidak lagi digunakan sudah dihapus di HTML
    // const nameInput = document.getElementById('name');
    // const phoneInput = document.getElementById('phone');
    // const addressInput = document.getElementById('address');
    // const searchDestinationInput = document.getElementById('searchDestination');
    // const zipCodeInput = document.getElementById('zip_code');

    const addressIdInput = document.getElementById('addressId');
    const courierIndexInput = document.getElementById('courierIndex');


    const tariffDropdown = document.getElementById('tariff');
    const shippingTariffDiv = document.getElementById('shippingTariff');
    const shippingCostInput = document.getElementById('shipping_cost');
    const grandTotalInput = document.getElementById('grandtotal');
    const courierInput = document.getElementById('courierInput');


    // Fungsi render option tarif pengiriman
    function renderTariffOptions(data) {
        tariffDropdown.innerHTML = '<option value="">Select a Courier</option>';
        let tarifList = [];

        if (data.data && Array.isArray(data.data)) {
            tarifList = data.data.map((item, index) => ({
                ...item,
                originalIndex: index
            }));
        }

        if (tarifList.length > 0) {
            shippingTariffDiv.style.display = 'block';
            tarifList.forEach(item => {
                const option = document.createElement('option');
                // FIX: Hapus ARTEFAK SINTAKS MARKDOWN di option.value
                option.value = `${item.shipping_name}-${item.service_name}-${item.originalIndex}`;
                // FIX: Hapus ARTEFAK SINTAKS MARKDOWN di option.textContent
                option.textContent =
                    `${item.shipping_name} ${item.service_name} - Rp${item.shipping_cost.toLocaleString()} - ETA: ${item.etd}`;
                option.dataset.shipping = JSON.stringify(item);
                tariffDropdown.appendChild(option);
            });
        } else {
            shippingTariffDiv.style.display = 'none';
        }
    }

    // Fungsi fetchAndCalculateTariff (Tidak ada perubahan di sini)
    function fetchAndCalculateTariff(addressIdToUse) {
        console.log("fetchAndCalculateTariff called with addressId:", addressIdToUse);
        const weightInGram = parseFloat(
            "{{ isset($cartItems['TotalWeight']) ? $cartItems['TotalWeight'] : 0 }}"
        ) || 0;

        // Konversi ke kilogram
        const weight = weightInGram / 1000;

        const itemValue = parseFloat(
            "{{ isset($cartItems['TotalPrice']) ? $cartItems['TotalPrice'] : 0 }}"
        ) || 0;



        if (!weight || !itemValue || !addressIdToUse) {
            console.error("Missing addressId, weight, or item value! Cannot fetch tariff.");
            shippingTariffDiv.style.display = 'none';
            tariffDropdown.innerHTML = '<option value="">Select a Courier</option>';
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
                    addressId: addressIdToUse,
                    weight: weight.toString(),
                    item_value: itemValue.toString()
                })
            })
            .then(response => {
                console.log("Raw API response from check-tariff:", response);
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Parsed API data from check-tariff:", data);
                renderTariffOptions(data);
            })
            .catch(error => {
                console.error('Error fetching shipping cost:', error);
                shippingTariffDiv.style.display = 'none';
                tariffDropdown.innerHTML =
                    '<option value="">Select a Courier</option>';
            });
    }

    // Event listener for when an address is selected from the dropdown
    selectAddressDropdown.addEventListener('change', () => {
        const selectedOption = selectAddressDropdown.options[selectAddressDropdown.selectedIndex];

        if (selectedOption && selectedOption.dataset.address) {
            const selectedAddress = JSON.parse(selectedOption.dataset.address);

            addressIdInput.value = selectedAddress.ID;
            fetchAndCalculateTariff(selectedAddress.ID);
        } else {
            addressIdInput.value = '';

            shippingTariffDiv.style.display = 'none';
            tariffDropdown.innerHTML = '<option value="">Select a Courier</option>';
        }
    });

    // Auto-select address and fetch tariff (Tidak ada perubahan di sini)
    document.addEventListener('DOMContentLoaded', () => {
        const initialAddressId = addressIdInput.value;
        if (initialAddressId) {
            const options = Array.from(selectAddressDropdown.options);
            const preSelectedOption = options.find(option => {
                if (option.dataset.address) {
                    const addressData = JSON.parse(option.dataset.address);
                    return addressData.ID === initialAddressId;
                }
                return false;
            });

            if (preSelectedOption) {
                selectAddressDropdown.value = preSelectedOption.value;
                fetchAndCalculateTariff(initialAddressId);
            }
        }
    });


    // Event pilihan tarif pengiriman berubah
    tariffDropdown.addEventListener('change', () => {
        const selectedOption = tariffDropdown.options[tariffDropdown.selectedIndex];
        if (selectedOption && selectedOption.dataset.shipping) {
            const shippingData = JSON.parse(selectedOption.dataset.shipping);
            const shippingCost = shippingData.shipping_cost || 0;
            const grandTotal = shippingData.grandtotal || 0;

            // FIX: Hapus ARTEFAK SINTAKS MARKDOWN di courier
            const courier = `${shippingData.shipping_name}-${shippingData.service_name}`;
            const courierIndex = shippingData.originalIndex;
            console.log('Selected Shipping Data:', shippingData);

            shippingCostInput.value = shippingCost;
            grandTotalInput.value = grandTotal;
            courierInput.value = courier;
            courierIndexInput.value = courierIndex;

            const shippingCostAmountElem = document.getElementById('shippingCostAmount');
            const shippingCostDisplayElem = document.getElementById('shippingCostDisplay');
            const grandTotalAmountElem = document.getElementById('grandTotalAmount');
            const grandTotalDisplayElem = document.getElementById('grandTotalDisplay');
            const uploadProofContainerElem = document.getElementById('uploadProofContainer');


            if (shippingCostAmountElem) shippingCostAmountElem.textContent =
                `Rp.${shippingCost.toLocaleString()}`;
            if (shippingCostDisplayElem) shippingCostDisplayElem.style.display = 'block';

            if (grandTotalAmountElem) grandTotalAmountElem.textContent = `Rp.${grandTotal.toLocaleString()}`;
            if (grandTotalDisplayElem) grandTotalDisplayElem.style.display = 'block';

            if (uploadProofContainerElem) uploadProofContainerElem.style.display = 'block';


            console.log('Selected Shipping Cost:', shippingCost);
            console.log('Selected Courier Index:', courierIndex);
        } else {
            shippingCostInput.value = 0;
            grandTotalInput.value = 0;
            courierInput.value = '';
            courierIndexInput.value = '';

            const shippingCostAmountElem = document.getElementById('shippingCostAmount');
            const shippingCostDisplayElem = document.getElementById('shippingCostDisplay');
            const grandTotalAmountElem = document.getElementById('grandTotalAmount');
            const grandTotalDisplayElem = document.getElementById('grandTotalDisplay');
            const uploadProofContainerElem = document.getElementById('uploadProofContainer');

            if (shippingCostAmountElem) shippingCostAmountElem.textContent = '';
            if (shippingCostDisplayElem) shippingCostDisplayElem.style.display = 'none';

            if (grandTotalAmountElem) grandTotalAmountElem.textContent = '';
            if (grandTotalDisplayElem) grandTotalDisplayElem.style.display = 'none';

            if (uploadProofContainerElem) uploadProofContainerElem.style.display = 'none';
        }
    });
</script>
