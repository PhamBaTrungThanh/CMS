@extends('layouts.admin')
@section('title', 'Create new Album')
@section('content')
    <div class="container-fluid">
        <form method="post" action="{{ route('admin.album.store') }}">
            <div class="row">
                <div class="col">
                    <div class="form-unit">
                        <label for="name">Name</label>
                        <input type="text" name="name" id="name" class="form-control" placeholder="Album name">
                    </div>
                    <div class="form-unit">
                        <label for="description">Description</label>
                        <textarea name="description" id="description" class="form-control" rows="5"></textarea>
                    </div>
                    <div class="form-unit">
                        <button type="submit">Create new album</button>
                    </div>
                </div>
                <div class="col">
                    <div class="form-unit">
                        <label for="cover">Album cover</label>
                        <input type="file" name="cover" id="cover" class="form-control">
                        <img src="" alt=""  id="selected_cover" class="fit">
                    </div>
                </div>
            </div>
            {{ csrf_field() }}
        </form>
    </div>
    <script language="javascript">
        document.getElementById("cover").addEventListener('change', function(event) {
            var file = event.target.files[0];
            var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {
                    document.getElementById("selected_cover").src = e.target.result;
                }
            })(file);
            reader.readAsDataURL(file);
        }, false);
    </script>
@endsection