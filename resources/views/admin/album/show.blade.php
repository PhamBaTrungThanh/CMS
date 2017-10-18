@extends('layouts.admin')
@section('title', $album->name)
@section('content')

@if (count($album->photos) == 0)
    <p class="text-center">No photo to show</p>
@else
    @if ($album->status == "proccessing")
        <h3 class="text-center">Proccessing Photos</h3>

        <form method="post">
            <input type="hidden" name="job" value="overirde_transform_status">
            {{ csrf_field() }}
            <input type="submit" value="Stop and reset">
        </form>
        <script language="javascript">
            setTimeout(function() {
                window.location.reload();
            }, 5000);
        </script>
    @else
        <div id="controls row">
            <div class="col text-center">
                <a href="#">@sprite(icon-sort)  Sort</a>
                
                <a href="#">@sprite(icon-trash-can) Delete</a>

            </div>
            <div class="col fixed">
                <a target="_blank" href="{{route('admin.album.add', $album)}}"><span class="text-center">Add new Photo</span></a>                
            </div>
        </div>
        <form class="photos sortable row" sortable="true" data-draggable=".photo-container" data-sorted-field="input[name=sorted-list]" method="post" >
            <input type="hidden" name="sorted-list" value="">
            <input type="hidden" name="job" value="sort-photo">

            @foreach ($album->photos as $photo)
                <label class="photo-container col fixed" for="photo-{{$photo->id}}" data-photo-id="{{$photo->id}}">
                    <img srcset="{{$photo->thumbnailSrc}}" width="200" height="200">
                </label> 
                <input type="checkbox" name="photo-{{$photo->id}}" id="photo-{{$photo->id}}" class="delete-photo" disabled>
            @endforeach
        </form>
    @endif

@endif

<br />
<a target="_blank" href="{{route('admin.album.add', $album)}}" id="upload-widget-opener"><h3 class="text-center">Add new Photo</h3></a>

@endsection