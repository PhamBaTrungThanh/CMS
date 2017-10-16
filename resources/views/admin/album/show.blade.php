@extends('layouts.admin')
@section('title', $album->name)
@section('content')

@if (count($album->photos) == 0)
    <p class="text-center">No photo to show</p>
@endif
<a href="#" id="upload-widget-opener"><h3 class="text-center">Add new Photo</h3></a>
<script src="//widget.cloudinary.com/global/all.js" type="text/javascript"></script>
<script src='//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js'></script>
<script language="javascript">
    $("#upload-widget-opener").on("click", function(event) {     
        cloudinary.openUploadWidget({ cloud_name: 'mazui-gallery', upload_preset: 'm0eygch6', theme: "white", context: {album_id: {{$album->id}} }, }, 
        function(error, result) { 
            if (error === null) {
                window.location.reload();
            }
         });
    });


</script>
@endsection