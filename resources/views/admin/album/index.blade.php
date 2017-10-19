@extends('layouts.admin')
@section('title', 'List all Albums')
@section('content')
    <div id="album_list">
        <div class="row">
            @foreach ($albums as $album)
                <div class="col album-container">
                    {{$album->name}}
                </div>
            @endforeach
        </div>
    </div>
@endsection