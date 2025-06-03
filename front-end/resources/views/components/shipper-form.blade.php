<meta name="csrf-token" content="{{ csrf_token() }}">
<div id="shipperForm" class="shipper-form mt-2" style="display: none;">
    <form id="formShip" action="/checkout" method="POST" enctype="multipart/form-data">
        @csrf

        <div class="mb-3">
            <label for="selectAddress" class="form-label">Select Shipping Address</label>
            <select class="form-control" id="selectAddress" name="selected_address_id" required>
                <option value="">-- Select an existing address --</option>
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

        {{-- Hidden fields to hold selected address details --}}
        <input type="hidden" id="name" name="name">
        <input type="hidden" id="phone" name="phone_number">
        <input type="hidden" id="address" name="address">
        <input type="hidden" id="searchDestination" name="destination_label">
        <input type="hidden" id="destination_id" name="destination_id">
        <input type="hidden" id="zip_code" name="zip_code">


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
</div>

<script>
    const selectAddressDropdown = document.getElementById('selectAddress');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const searchDestinationInput = document.getElementById('searchDestination');
    const destinationIdInput = document.getElementById('destination_id');
    const zipCodeInput = document.getElementById('zip_code');

    const tariffDropdown = document.getElementById('tariff');
    const shippingTariffDiv = document.getElementById('shippingTariff');
    const shippingCostInput = document.getElementById('shipping_cost');
    const grandTotalInput = document.getElementById('grandtotal');
    const courierInput = document.getElementById('courierInput');

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

    // Event listener for when an address is selected from the dropdown
    selectAddressDropdown.addEventListener('change', () => {
        const selectedOption = selectAddressDropdown.options[selectAddressDropdown.selectedIndex];

        if (selectedOption && selectedOption.dataset.address) {
            const selectedAddress = JSON.parse(selectedOption.dataset.address);

            // Populate hidden fields with selected address data
            nameInput.value = selectedAddress.RecipientsName || '';
            phoneInput.value = selectedAddress.RecipientsNumber || '';
            addressInput.value = selectedAddress.Address || '';
            searchDestinationInput.value = selectedAddress.DestinationLabel || '';
            destinationIdInput.value = selectedAddress.DestinationID || '';
            zipCodeInput.value = selectedAddress.ZipCode || '';

            // Now, trigger tariff calculation based on the selected address
            const destinationId = selectedAddress.DestinationID;

            if (destinationId) {
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
                                .querySelector('meta[name="csrf-token"]')
                                .getAttribute('content')
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
                        console.error('Error fetching shipping cost:', error);
                    });
            } else {
                // If no destination ID, hide tariff options
                shippingTariffDiv.style.display = 'none';
                tariffDropdown.innerHTML = '<option value="">Select a Courier</option>';
            }
        } else {
            // If "-- Select an existing address --" is chosen, clear fields and hide tariff
            nameInput.value = '';
            phoneInput.value = '';
            addressInput.value = '';
            searchDestinationInput.value = '';
            destinationIdInput.value = '';
            zipCodeInput.value = '';

            shippingTariffDiv.style.display = 'none';
            tariffDropdown.innerHTML = '<option value="">Select a Courier</option>';
        }
    });
    document.addEventListener('DOMContentLoaded', () => {
        // Find the option that matches the initially loaded destination_id
        const initialDestinationId = destinationIdInput.value;
        if (initialDestinationId) {
            const options = Array.from(selectAddressDropdown.options);
            const preSelectedOption = options.find(option => {
                if (option.dataset.address) {
                    const addressData = JSON.parse(option.dataset.address);
                    return addressData.DestinationID === initialDestinationId;
                }
                return false;
            });

            if (preSelectedOption) {
                // Set the dropdown's value
                selectAddressDropdown.value = preSelectedOption.value;
                // Manually trigger the change event to populate fields and fetch tariff
                selectAddressDropdown.dispatchEvent(new Event('change'));
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
            const courier = `${shippingData.shipping_name}-${shippingData.service_name}-(${shippingData.type})`;
            console.log(shippingData);

            shippingCostInput.value = shippingCost;
            grandTotalInput.value = grandTotal;
            courierInput.value = courier;
            const shippingCostAmountElem = document.getElementById('shippingCostAmount');
            const shippingCostDisplayElem = document.getElementById('shippingCostDisplay');
            const grandTotalAmountElem = document.getElementById('grandTotalAmount');
            const grandTotalDisplayElem = document.getElementById('grandTotalDisplay');
            const uploadProofContainerElem = document.getElementById('uploadProofContainer');


            if (shippingCostAmountElem) shippingCostAmountElem.textContent = `Rp.${shippingCost.toLocaleString()}`;
            if (shippingCostDisplayElem) shippingCostDisplayElem.style.display = 'block';

            if (grandTotalAmountElem) grandTotalAmountElem.textContent = `Rp.${grandTotal.toLocaleString()}`;
            if (grandTotalDisplayElem) grandTotalDisplayElem.style.display = 'block';

            if (uploadProofContainerElem) uploadProofContainerElem.style.display = 'block';


            console.log('Selected Shipping Cost:', shippingCost);
        } else {
            // Clear shipping cost and grand total if no valid option is selected
            shippingCostInput.value = 0;
            grandTotalInput.value = 0;
            courierInput.value = '';

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