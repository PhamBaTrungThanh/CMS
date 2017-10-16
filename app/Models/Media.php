<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Photo;
class Media extends Model
{
    protected $fillable = [
        'format', 'width', 'height', 'bytes', 'public_id', 'url', 'original_url',
    ];
    public function photo()
    {
        return $this->belongsTo(Photo::class, 'cloudinary_public_id', 'public_id');
    }
}
