@extends('layout.master')

@section('container')
    <main>
        <!-- Page banner area start here -->
        <section class="page-banner bg-image">
        </section>

        <section class="login-area pt-30 pb-130">
            <h2 class="mb-4">Upload Foto dan Pilih Pakaian</h2>

            <form method="POST" action="/try-on" enctype="multipart/form-data">
                @csrf

                <div class="mb-3">
                    <label for="photo" class="form-label">Upload Foto:</label>
                    <input type="file" class="form-control" id="photo" name="photo" accept="image/*" required>
                </div>

                <div class="mb-3">
                    <label for="clothes" class="form-label">Pilih Pakaian:</label>
                    <div class="row">
                        @foreach ($clothes as $item)
                            <div class="col-4">
                                <label class="image-container">
                                    <input type="radio" name="clothes" value="{{ $item }}" hidden>
                                    <img src="http://localhost:8001/clothes/{{ $item }}" alt="{{ $item }}"
                                        class="img-fluid clothes-image">
                                </label>
                            </div>
                        @endforeach
                    </div>
                </div>

                <style>
                    .image-container {
                        display: inline-block;
                        position: relative;
                        cursor: pointer;
                    }

                    .clothes-image {
                        width: 100%;
                        border: 2px solid transparent;
                        transition: border 0.3s ease;
                    }

                    .image-container input[type="radio"]:checked+.clothes-image {
                        border-color: blue;
                    }

                    .image-container input[type="radio"] {
                        display: none;
                    }

                    .image-container:hover .clothes-image {
                        opacity: 0.8;
                    }
                </style>

                <button type="submit" class="btn btn-primary">Try On</button>
            </form>
        </section>
    </main>
@stop
