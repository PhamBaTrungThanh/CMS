@extends('layouts.app')
@section('title', 'Trang chủ')
@section('content')

<div id="homepage">

    <div id="album-list">
        @foreach ($albums as $album)
            @include('includes.album_bits')
        @endforeach
    </div>     
</div>
@endsection