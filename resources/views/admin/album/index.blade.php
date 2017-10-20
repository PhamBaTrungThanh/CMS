@extends('layouts.admin')
@section('title', 'List all Albums')
@section('content')
    <div id="album_list">
        <div class="row">
            @foreach ($albums as $album)
                <div class="col fixed album-container">
                    <div class="album-content z-depth-1">
                        <a href="{{route('admin.album.show', $album)}}">
                            <img src="{{asset('storage/'.$album->cover)}}" alt="{{$album->name}}"/>
                            <div class="album-meta">
                                <h4>{{$album->name}}</h4>
                            </div>
                        </a>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
@endsection