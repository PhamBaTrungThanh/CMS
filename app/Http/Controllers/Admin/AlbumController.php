<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

use App\Models\Album;
use App\Models\Tag;

use App\Events\RequestDeletePhoto;
use App\Events\TaggingContent;
class AlbumController extends Controller
{
    public function index()
    {
        $albums = Album::orderBy('created_at', 'desc')->get();

        return view('admin.album.index')->withAlbums($albums);
    }
    public function create()
    {
        return view('admin.album.create');
    }
    public function add(Album $album)
    {
        return view('admin.album.add')->withAlbum($album);
    }
    public function store(Request $request)
    {
        $album = new Album;
        $album->name = $request->input('name');
        $album->slug = str_slug($request->input('name'));
        $album->description = $request->input('description');
        $album->cover = $request->file('cover')->store('album_covers');
        $album->shot_at = $request->input('shot_at');
        $album->save();

        /* tags */
        if ($request->filled('tags')) {
            event(new TaggingContent(Album::class, $album->id, $request->input('tags')));
        }   
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

            session()->flash('message_type', 'success');
            session()->flash('message', 'Reset album state.');
        }
        if ($request->input('job') === "sort_photos")
        {
            $temp = json_decode($request->input('sorted_list'), true);
            
            $effected = array_diff_assoc($temp[0], $temp[1]);
            foreach($effected as $id => $order) {
                $album->photos()->where('id', $id)->update(['order' => $order]);
            }
            session()->flash('message_type', 'success');
            session()->flash('message', 'Photos sorted.');
        }
        if ($request->input('job') === "delete_photos")
        {
            $album->load('photos.media');
            $photos = $album->photos->reject(function ($photo) {
                return !in_array($photo->id, request()->input('photo_ids'));
            });
            foreach($photos as $photo) 
            {
                event(new RequestDeletePhoto($photo));
            }
            session()->flash('message_type', 'success');
            session()->flash('message', 'Photos deleted.');            
        }
        if ($request->input('job') === "delete_album")
        {
            Storage::delete($album->cover);
            foreach($album->photos as $photo) {
                event(new RequestDeletePhoto($photo));
            }
            $album->tags()->detach();
            $album->delete();
            return redirect(route('admin.album.index'));
        }
        return redirect(route('admin.album.show', $album));
    }
    public function show(int $album_id)
    {
        
        $album = Album::where('id', $album_id)->with(['photos', 'photos.media'])->first();
        return view('admin.album.show')
                ->withAlbum($album);
    }
}
