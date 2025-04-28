<div id="shipperForm" class="shipper-form" style="display: none;">
    <form id="formShip" action="" method="POST">
        @csrf
        <div class="mb-3">
            <label for="name" class="form-label">Full Name</label>
            <input type="text" class="form-control" id="name" name="name" required>
        </div>
        <div class="mb-3">
            <label for="address" class="form-label">Shipping Address</label>
            <textarea class="form-control" id="address" name="address" rows="3" required></textarea>
        </div>
        <div class="mb-3">
            <label for="zip_code" class="form-label">Zip Code</label>
            <input type="text" class="form-control" id="zip_code" name="zip_code" required>
        </div>
        <div class="mb-3">
            <label for="province" class="form-label">Province</label>
            <select class="form-select" id="province" name="province" required>
                <option value="">Select Province</option>
                <!-- Provinsi akan diisi oleh JavaScript -->
            </select>
        </div>
        <div class="mb-3">
            <label for="city" class="form-label">City</label>
            <select class="form-select" id="city" name="city" required>
                <option value="">Select City</option>
                <!-- Kota akan diisi berdasarkan provinsi yang dipilih -->
            </select>
        </div>
        <div class="mb-3">
            <label for="phone" class="form-label">Phone Number</label>
            <input type="text" class="form-control" id="phone" name="phone" required>
        </div>
    </form>
</div>

<script>
    // Data Provinsi dan Kota
    const data = {
    "provinsi": [
        {"id": "1", "name": "Aceh"},
        {"id": "2", "name": "Bali"},
        {"id": "3", "name": "Banten"},
        {"id": "4", "name": "Bengkulu"},
        {"id": "5", "name": "Gorontalo"},
        {"id": "6", "name": "Jakarta"},
        {"id": "7", "name": "Jambi"},
        {"id": "8", "name": "Jawa Barat"},
        {"id": "9", "name": "Jawa Tengah"},
        {"id": "10", "name": "Jawa Timur"},
        {"id": "11", "name": "Kalimantan Barat"},
        {"id": "12", "name": "Kalimantan Selatan"},
        {"id": "13", "name": "Kalimantan Tengah"},
        {"id": "14", "name": "Kalimantan Timur"},
        {"id": "15", "name": "Kepulauan Riau"},
        {"id": "16", "name": "Lampung"},
        {"id": "17", "name": "Maluku"},
        {"id": "18", "name": "Maluku Utara"},
        {"id": "19", "name": "Nusa Tenggara Barat"},
        {"id": "20", "name": "Nusa Tenggara Timur"},
        {"id": "21", "name": "Papua"},
        {"id": "22", "name": "Papua Barat"},
        {"id": "23", "name": "Riau"},
        {"id": "24", "name": "Sulawesi Barat"},
        {"id": "25", "name": "Sulawesi Selatan"},
        {"id": "26", "name": "Sulawesi Tengah"},
        {"id": "27", "name": "Sulawesi Tenggara"},
        {"id": "28", "name": "Sulawesi Utara"},
        {"id": "29", "name": "Sumatera Barat"},
        {"id": "30", "name": "Sumatera Selatan"},
        {"id": "31", "name": "Sumatera Utara"}
    ],
    "kota": {
        "1": [ // Aceh
            {"id": "1", "name": "Banda Aceh"},
            {"id": "2", "name": "Lhokseumawe"},
            {"id": "3", "name": "Langsa"},
            {"id": "4", "name": "Sabang"}
        ],
        "2": [ // Bali
            {"id": "1", "name": "Denpasar"},
            {"id": "2", "name": "Badung"},
            {"id": "3", "name": "Gianyar"},
            {"id": "4", "name": "Buleleng"}
        ],
        "3": [ // Banten
            {"id": "1", "name": "Serang"},
            {"id": "2", "name": "Tangerang"},
            {"id": "3", "name": "Cilegon"},
            {"id": "4", "name": "Pandeglang"}
        ],
        "4": [ // Bengkulu
            {"id": "1", "name": "Bengkulu"},
            {"id": "2", "name": "Kota Bengkulu"},
            {"id": "3", "name": "Rejang Lebong"}
        ],
        "5": [ // Gorontalo
            {"id": "1", "name": "Gorontalo"},
            {"id": "2", "name": "Bone Bolango"},
            {"id": "3", "name": "Pohuwato"}
        ],
        "6": [ // Jakarta
            {"id": "1", "name": "Central Jakarta"},
            {"id": "2", "name": "East Jakarta"},
            {"id": "3", "name": "North Jakarta"},
            {"id": "4", "name": "West Jakarta"},
            {"id": "5", "name": "South Jakarta"}
        ],
        "7": [ // Jambi
            {"id": "1", "name": "Jambi"},
            {"id": "2", "name": "Muaro Jambi"},
            {"id": "3", "name": "Tanjung Jabung Barat"}
        ],
        "8": [ // Jawa Barat
            {"id": "1", "name": "Bandung"},
            {"id": "2", "name": "Bekasi"},
            {"id": "3", "name": "Bogor"},
            {"id": "4", "name": "Cirebon"},
            {"id": "5", "name": "Tasikmalaya"}
        ],
        "9": [ // Jawa Tengah
            {"id": "1", "name": "Semarang"},
            {"id": "2", "name": "Solo"},
            {"id": "3", "name": "Salatiga"},
            {"id": "4", "name": "Magelang"},
            {"id": "5", "name": "Pekalongan"}
        ],
        "10": [ // Jawa Timur
            {"id": "1", "name": "Surabaya"},
            {"id": "2", "name": "Malang"},
            {"id": "3", "name": "Madiun"},
            {"id": "4", "name": "Banyuwangi"}
        ],
        "11": [ // Kalimantan Barat
            {"id": "1", "name": "Pontianak"},
            {"id": "2", "name": "Singkawang"},
            {"id": "3", "name": "Sambas"}
        ],
        "12": [ // Kalimantan Selatan
            {"id": "1", "name": "Banjarmasin"},
            {"id": "2", "name": "Banjarbaru"},
            {"id": "3", "name": "Martapura"}
        ],
        "13": [ // Kalimantan Tengah
            {"id": "1", "name": "Palangka Raya"},
            {"id": "2", "name": "Kuala Kapuas"},
            {"id": "3", "name": "Sampit"}
        ],
        "14": [ // Kalimantan Timur
            {"id": "1", "name": "Samarinda"},
            {"id": "2", "name": "Balikpapan"},
            {"id": "3", "name": "Kutai Kartanegara"}
        ],
        "15": [ // Kepulauan Riau
            {"id": "1", "name": "Tanjung Pinang"},
            {"id": "2", "name": "Batam"},
            {"id": "3", "name": "Karimun"}
        ],
        // Tambahkan data kota lainnya untuk provinsi yang tersisa sesuai kebutuhan
    }
}
    // Fungsi untuk mengisi dropdown provinsi
    function populateProvinces() {
        const provinceSelect = document.getElementById('province');
        data.provinsi.forEach(prov => {
            const option = document.createElement('option');
            option.value = prov.id;
            option.textContent = prov.name;
            provinceSelect.appendChild(option);
        });
    }

    // Fungsi untuk mengisi dropdown kota berdasarkan provinsi yang dipilih
    function populateCities(provinceId) {
        const citySelect = document.getElementById('city');
        citySelect.innerHTML = '<option value="">Select City</option>'; // Clear previous cities

        if (provinceId && data.kota[provinceId]) {
            data.kota[provinceId].forEach(city => {
                const option = document.createElement('option');
                option.value = city.id;
                option.textContent = city.name;
                citySelect.appendChild(option);
            });
        }
    }

    // Event listener untuk menangani perubahan provinsi
    document.getElementById('province').addEventListener('change', function() {
        populateCities(this.value);
    });

    // Panggil fungsi untuk mengisi provinsi saat halaman dimuat
    document.addEventListener('DOMContentLoaded', function() {
        populateProvinces();
    });
</script>
