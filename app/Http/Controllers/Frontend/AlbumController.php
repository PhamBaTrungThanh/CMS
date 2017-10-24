<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Album;
class AlbumController extends Controller
{
    public function show(String $album_slug)
    {
        $album = Album::where('slug', $album_slug)->with(['photos', 'photos.media'])->paginate(60);
        dd($album);
    }
}
