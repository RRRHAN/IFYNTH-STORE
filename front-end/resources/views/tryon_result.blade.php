@extends('layout.master')
@section('container')
    <main>
        <section class="page-banner bg-image">
        </section>
        <h2>Hasil Virtual Try-On</h2>
        <img src="{{ $result_url }}" alt="Hasil" style="max-width: 400px;"><br><br>
        <a href="/">Coba Lagi</a>
    </main>
@stop
