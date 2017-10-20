@extends('layouts.admin')
@section('title', $album->name)
@section('content')
<div id="album-singular">
    <form  method="post" class="delete-album">
        {{ csrf_field() }}
        <input type="hidden" name="job" value="delete_album">
        <input type="submit" value="Delete this Album">
    </form>
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
            <form method="post">
                <div class="controls row">
                    <div class="col fixed">
                        <input type="submit" value="Submit">
                    </div>
                    <div class="col text-center mode">
                        <input type="radio" name="job" id="job-sort" value="sort_photos" checked>
                        <label for="job-sort" onClick="admin_photoDeletable(false)" >Sort</label>
                        <input type="radio" name="job" id="job-delete" value="delete_photos">
                        <label for="job-delete" onClick="admin_photoDeletable(true)">Delete</label>
                    </div>
                    <div class="col fixed">
                        <a target="_blank" href="{{route('admin.album.add', $album)}}"><span class="text-center">Add new Photo</span></a>                
                    </div>
                </div>
                <div class="photos sortable row" sortable="true" data-draggable=".photo-container" data-sorted-field="input[name=sorted_list]" >
                    <input type="hidden" name="sorted_list" value="">
                    
                    @foreach ($album->photos as $photo)
                        <div class="photo-container col fixed" data-photo-id="{{$photo->id}}">
                            <input type="checkbox" name="photo_ids[]" id="photo-{{$photo->id}}"  class="delete-photo" value="{{$photo->id}}" disabled>
                            <label class="photo-content" for="photo-{{$photo->id}}" >
                                <img srcset="{{$photo->thumbnailSrc}}" width="200" height="200">
                            </label>  
                        </div>
                    

                    @endforeach
                </div>
                {{ csrf_field() }}
            </form>
        @endif

    @endif

    <br />
    <a target="_blank" href="{{route('admin.album.add', $album)}}" id="upload-widget-opener"><h3 class="text-center">Add new Photo</h3></a>
</div>
@endsection