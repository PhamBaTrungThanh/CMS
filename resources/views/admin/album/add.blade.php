@extends('layouts.admin')
@section('title', "Add Photos")
@section('content')
<style>
    #app {
        display: none;
    }
</style>
<script src="//widget.cloudinary.com/global/all.js" type="text/javascript"></script>
<script src='//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js'></script>
<script language="javascript">
    var http = "b89a3ea9.ngrok.io";
    var widget = cloudinary.createUploadWidget({ 
            cloud_name: 'mazui-gallery',
            upload_preset: 'm0eygch6',
            theme: "white",
            context: {album_id: {{$album->id}} },
            notification_url: "http://" + http + "/callback/admin/photo/upload",
            eager_notification_url: "http://" + http + "/callback/admin/photo/transform",
        }, 
        function(error, result) { 
            if (window.opener) {
                window.opener.location.reload();
                window.close();
                
            }
            window.location.href = "{{route('admin.album.show', $album)}}";
         });

    widget.open();
</script>
@endsection