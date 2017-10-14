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
        dd($request);
    }
}
