<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Album;

class HomeController extends Controller
{
    public function index()
    {
        $albums = Album::orderBy('created_at', 'desc')->paginate('10');
        if ($albums->currentPage() === 1) {
            $albums[0]->class="latest";
        }
        return view('frontend.index')->withAlbums($albums);
    }
}
