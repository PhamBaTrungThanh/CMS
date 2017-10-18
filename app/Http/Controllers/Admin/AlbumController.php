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
    public function add(Album $album)
    {
        $album->status = "proccessing";
        $album->save();
        return view('admin.album.add')->withAlbum($album);
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
    public function update(Request $request, Album $album)
    {
        if ($request->input('job') === "overirde_transform_status")
        {
            $album->photos()->where('status', 'transforming')->delete();
            $album->status = "completed";
            $album->save();
        }
        return route('admin.album.show', $album);
    }
    public function show(int $album_id)
    {
        
        $album = Album::where('id', $album_id)->with(['photos', 'photos.media'])->first();
        return view('admin.album.show')
                ->withAlbum($album);
    }
}
