<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Album;
use App\Models\Tag;

class HomeController extends Controller
{
    public function index()
    {
        $tags = Tag::withCount('taggables')->orderBy('taggables_count', 'desc')->take(7)->get();
        $albums = Album::orderBy('created_at', 'desc')->paginate('10');
        if ($albums->currentPage() === 1) {
            $albums[0]->class="latest";
        }
        return view('frontend.index')->withAlbums($albums)->withTags($tags);
    }
}
