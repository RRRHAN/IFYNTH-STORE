{{-- resources/views/components/updateAddressModal.blade.php --}}
<div class="modal fade" id="updateAddressModal" tabindex="-1" aria-labelledby="updateAddressModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="updateAddressModalLabel">Update Address</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="updateAddressForm" action="" method="POST"> {{-- Corrected: id is fixed, action is empty --}}
                    @csrf
                    @method('PUT') {{-- Use PUT method for updates --}}
                    <input type="hidden" name="address_id" id="update_address_id">

                    <div class="row g-3">
                        <div class="col-md-6 mb-3">
                            <label for="update_recipient_name_modal" class="form-label">Recipient's Name</label>
                            <input type="text" class="form-control" id="update_recipient_name_modal"
                                name="recipient_name" placeholder="e.g., John Doe" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="update_recipient_number_modal_container" class="form-label">Recipient's Phone
                                Number</label>
                            <div class="input-group">
                                <span class="input-group-text">+62</span>
                                <input type="text" class="form-control" id="update_recipient_number_modal"
                                    name="recipient_number" placeholder="e.g., 81234567890" required
                                    pattern="[0-9]{8,15}"
                                    title="Please enter a valid phone number (8-15 digits, no leading 0)"
                                    oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value.startsWith('0')) this.value = this.value.substring(1);">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="update_address_modal" class="form-label">Address</label>
                            <textarea class="form-control" id="update_address_modal" name="address" rows="3"
                                placeholder="e.g., Jalan Contoh No. 123, Desa Maju" required></textarea>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-md-8">
                                <label for="update_searchDestination_modal" class="form-label">City, Province</label>
                                <input type="text" class="form-control" id="update_searchDestination_modal"
                                    placeholder="e.g., Surabaya" autocomplete="off" name="destination_label" required>
                                <input type="hidden" id="update_destination_id_modal" name="destination_id">
                                <ul id="update_suggestions_modal" class="list-group position-absolute w-50 mt-1"
                                    style="z-index: 1000; max-height: 200px; overflow-y: auto;"></ul>
                            </div>
                            <div class="col-md-4">
                                <label for="update_zip_code_modal" class="form-label">Zip Code</label>
                                <input type="text" class="form-control" id="update_zip_code_modal" name="zip_code"
                                    maxlength="5" placeholder="e.g., 60123" inputmode="numeric" pattern="\d{5}"
                                    oninput="this.value = this.value.replace(/[^0-9]/g, '')" required>
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </form>
            </div>
        </div>
    </div>
</div>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // --- Common Search Functionality for Both Modals ---
        function setupSearchAndSuggestions(searchInputId, zipCodeInputId, suggestionBoxId,
        destinationIdInputId) {
            const searchInput = document.getElementById(searchInputId);
            const zipCodeInput = document.getElementById(zipCodeInputId);
            const suggestionBox = document.getElementById(suggestionBoxId);
            const destinationIdInput = document.getElementById(destinationIdInputId);

            let debounceTimer;

            if (!searchInput || !zipCodeInput || !suggestionBox || !destinationIdInput) {
                console.warn(
                    `One or more elements not found for search setup: ${searchInputId}, ${zipCodeInputId}, ${suggestionBoxId}, ${destinationIdInputId}`
                    );
                return;
            }

            searchInput.addEventListener('input', function() {
                const query = this.value.trim();
                clearTimeout(debounceTimer);

                if (query.length < 3) {
                    suggestionBox.innerHTML = '';
                    return;
                }

                debounceTimer = setTimeout(() => {
                    fetch(`/search-destination?q=${encodeURIComponent(query)}&limit=5&offset=0`)
                        .then(res => res.json())
                        .then(data => {
                            console.log('API Response:', data);
                            suggestionBox.innerHTML = '';

                            if (data.data && data.data.length > 0) {
                                data.data.forEach(item => {
                                    const li = document.createElement('li');
                                    li.className =
                                        'list-group-item list-group-item-action';
                                    li.textContent =
                                        `${item.subdistrict_name}, ${item.district_name}, ${item.city_name}, ${item.province_name}`;
                                    li.dataset.zip = item.zip_code || '';
                                    li.dataset.id = item.id;
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
                }, 300);
            });

            suggestionBox.addEventListener('click', function(e) {
                if (e.target && e.target.matches('li.list-group-item-action')) {
                    searchInput.value = e.target.textContent;
                    zipCodeInput.value = e.target.dataset.zip;
                    destinationIdInput.value = e.target.dataset.id;
                    console.log('Selected Destination ID:', e.target.dataset.id);
                    suggestionBox.innerHTML = '';
                }
            });

            // Close suggestion box if clicked outside search elements
            document.addEventListener('click', function(e) {
                if (!searchInput.contains(e.target) && !suggestionBox.contains(e.target)) {
                    suggestionBox.innerHTML = '';
                }
            });
        }

        // --- Setup for Add Address Modal ---
        // Ensure your components.addressModal uses these IDs or adjust here
        setupSearchAndSuggestions(
            'searchDestination_modal',
            'zip_code_modal',
            'suggestions_modal',
            'destination_id_modal'
        );

        // --- Setup for Update Address Modal ---
        const updateAddressModal = document.getElementById('updateAddressModal');
        const updateAddressForm = document.getElementById('updateAddressForm');
        const updateAddressIdInput = document.getElementById('update_address_id');
        const updateRecipientNameInput = document.getElementById('update_recipient_name_modal');
        const updateRecipientNumberInput = document.getElementById('update_recipient_number_modal');
        const updateAddressInput = document.getElementById('update_address_modal');
        const updateSearchDestinationInput = document.getElementById('update_searchDestination_modal');
        const updateZipCodeInput = document.getElementById('update_zip_code_modal');
        const updateDestinationIdInput = document.getElementById('update_destination_id_modal');

        // Apply search functionality to the update modal fields
        setupSearchAndSuggestions(
            'update_searchDestination_modal',
            'update_zip_code_modal',
            'update_suggestions_modal',
            'update_destination_id_modal'
        );

        // Event listener for when the update modal is about to be shown
        updateAddressModal.addEventListener('show.bs.modal', function(event) {
            // Button that triggered the modal
            const button = event.relatedTarget;
            // Extract info from data-address attributes
            const address = JSON.parse(button.getAttribute('data-address'));

            // Populate the form fields with the address data
            updateAddressIdInput.value = address.ID || '';
            updateRecipientNameInput.value = address.RecipientsName || '';
            // Remove +62 if present, and remove leading 0 if present (for display only)
            let rawPhoneNumber = address.RecipientsNumber ? String(address.RecipientsNumber) : '';
            if (rawPhoneNumber.startsWith('+62')) {
                rawPhoneNumber = rawPhoneNumber.substring(3).trim(); // Remove +62 and any space
            }
            if (rawPhoneNumber.startsWith('0')) {
                rawPhoneNumber = rawPhoneNumber.substring(1); // Remove leading 0
            }
            updateRecipientNumberInput.value = rawPhoneNumber;

            updateAddressInput.value = address.Address || '';
            updateSearchDestinationInput.value = address.DestinationLabel || '';
            updateZipCodeInput.value = address.ZipCode || '';
            updateDestinationIdInput.value = address.DestinationID || '';

            // Set the form action dynamically
            updateAddressForm.action = `/updateAddress/${address.ID}`;
        });

        // Event listener to clear suggestions when the update modal is hidden
        updateAddressModal.addEventListener('hidden.bs.modal', function() {
            document.getElementById('update_suggestions_modal').innerHTML = '';
        });
    });
</script>
