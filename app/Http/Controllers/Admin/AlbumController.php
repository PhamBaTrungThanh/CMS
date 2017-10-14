<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Album;

class AlbumController extends Controller
{
    public function create()
    {
        return view('admin.album.create');
    }
    public function store(Request $request)
    {
        $album = new Album;
        $album->name = $request->input('name');
        $album->slug = str_slug($request->input('name'));
        $album->description = $request->input('description');
        $album->save();
        session()->flash('message_type', 'success');
        session()->flash('message', 'New album created');
        return redirect(route('admin.album.show', ["id" => $album->id]));
    }

    public function show(Album $album)
    {
        return view('admin.album.show')->withAlbum($album);
    }
}
