@extends('layouts.app')
@section('title', 'Trang chủ')
@section('content')
    <nav id="top-menu">
        @foreach ($tags as $tag)
            <a href=""><span>{{$tag->name}}</span></a>
        @endforeach
    </nav>
    <main>        
    <div id="homepage">

        <div id="album-list">
            @foreach ($albums as $album)
                @include('includes.album_bits')
            @endforeach
        </div>     

        {{ $albums->links() }}
    </div>
</main>
@endsection