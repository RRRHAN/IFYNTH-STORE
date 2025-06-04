    <div class="modal fade" id="addAddressModal" tabindex="-1" aria-labelledby="addAddressModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addAddressModalLabel">Add New Address</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form action="/addAddress" method="POST">
                        @csrf
                        <div class="row g-3">
                            <div class="col-md-6 mb-3">
                                <label for="recipient_name_modal" class="form-label">Recipient's Name</label>
                                <input type="text" class="form-control" id="recipient_name_modal"
                                    name="recipient_name" placeholder="e.g., John Doe" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="recipient_number_modal_container" class="form-label">Recipient's Phone Number</label>
                                <div class="input-group">
                                    <span class="input-group-text" id="basic-addon1">+62</span>
                                    <input type="text" class="form-control" id="recipient_number_modal"
                                        name="recipient_number" placeholder="e.g., 81234567890" required
                                        pattern="[0-9]{8,15}"
                                        title="Please enter a valid phone number (8-15 digits, no leading 0)"
                                        oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value.startsWith('0')) this.value = this.value.substring(1);">
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="address_modal" class="form-label">Address</label>
                                <textarea class="form-control" id="address_modal" name="address" rows="3"
                                    placeholder="e.g., Jalan Contoh No. 123, Desa Maju" required></textarea>
                            </div>
                            <div class="mb-3 row">
                                <div class="col-md-8">
                                    <label for="searchDestination_modal" class="form-label">City, Province</label>
                                    <input type="text" class="form-control" id="searchDestination_modal"
                                        placeholder="e.g., Surabaya" autocomplete="off" name="destination_label"
                                        required>
                                    <input type="hidden" id="destination_id_modal" name="destination_id">
                                    <ul id="suggestions_modal" class="list-group position-absolute w-50 mt-1"
                                        style="z-index: 1000; max-height: 200px; overflow-y: auto;"></ul>
                                </div>
                                <div class="col-md-4">
                                    <label for="zip_code_modal" class="form-label">Zip Code</label>
                                    <input type="text" class="form-control" id="zip_code_modal" name="zip_code"
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
</div>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const searchInput = document.getElementById('searchDestination_modal');
        const zipCodeInput = document.getElementById('zip_code_modal');
        const suggestionBox = document.getElementById('suggestions_modal');
        const destinationIdInput = document.getElementById('destination_id_modal');

        let debounceTimer;

        // Event listener for search input
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

        // Event listener to select a suggestion from the list
        suggestionBox.addEventListener('click', function(e) {
            if (e.target && e.target.matches('li.list-group-item-action')) {
                searchInput.value = e.target.textContent;
                zipCodeInput.value = e.target.dataset.zip;
                destinationIdInput.value = e.target.dataset
                .id; // Set the hidden input for destination ID

                console.log('Selected Destination ID:', e.target.dataset.id);

                suggestionBox.innerHTML = ''; // Clear suggestions after selection
            }
        });

        // Close suggestion box if clicked outside search elements
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !suggestionBox.contains(e.target)) {
                suggestionBox.innerHTML = '';
            }
        });
    });
</script>