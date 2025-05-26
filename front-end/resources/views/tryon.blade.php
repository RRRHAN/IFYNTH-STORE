@extends('layout.master')

@section('container')
<main>
    <section class="page-banner bg-image">
        <!-- Banner Section - Anda bisa menambahkan gambar latar atau elemen lainnya di sini -->
    </section>

    <div class="container mt-5">
        <h2 class="text-center">Virtual Try-On</h2>

        <div class="row justify-content-center">
            <div class="col-md-8">
                <form id="tryon-form" enctype="multipart/form-data">
                    <!-- Person Image -->
                    <div class="mb-3">
                        <label for="person_image" class="form-label">Person Image</label>
                        <input type="file" id="person_image" name="person_image" accept="image/*" class="form-control" required>
                    </div>

                    <!-- Garment Image -->
                    <div class="mb-3">
                        <label for="garment_image" class="form-label">Garment Image</label>
                        <input type="file" id="garment_image" name="garment_image" accept="image/*" class="form-control" required>
                    </div>

                    <!-- Seed -->
                    <div class="mb-3">
                        <label for="seed" class="form-label">Seed</label>
                        <input type="number" id="seed" name="seed" class="form-control">
                    </div>

                    <!-- Randomize Seed -->
                    <div class="mb-3 form-check">
                        <input type="checkbox" id="randomize_seed" name="randomize_seed" class="form-check-input">
                        <label for="randomize_seed" class="form-check-label">Randomize Seed</label>
                    </div>

                    <button type="submit" class="btn btn-primary w-100">Run</button>
                </form>
            </div>
        </div>

        <!-- Hasil Try-On -->
        <div id="result" class="mt-5 text-center">
            <!-- Hasil dari try-on akan ditampilkan di sini -->
        </div>
    </div>
</main>

<!-- Include Axios -->
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

<script>
    document.getElementById('tryon-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('person_image', document.getElementById('person_image').files[0]);
        formData.append('garment_image', document.getElementById('garment_image').files[0]);
        formData.append('seed', document.getElementById('seed').value);
        formData.append('randomize_seed', document.getElementById('randomize_seed').checked);

        uploadImages(formData);
    });

    const uploadImages = async (formData) => {
        try {
            const response = await axios.post('http://127.0.0.1:5555/tryon', formData);
            const result = response.data;
            if (result.result_image) {
                document.getElementById('result').innerHTML = `
                    <h3>Hasil Try-On:</h3>
                    <img src="data:image/jpeg;base64,${result.result_image}" alt="Try-On Result" class="img-fluid" />
                `;
            }
        } catch (error) {
            document.getElementById('result').innerHTML = '<p class="text-danger">Error: Gagal mengirim request.</p>';
        }
    };
</script>
@endsection
