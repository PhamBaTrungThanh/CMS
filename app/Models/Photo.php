<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Album;
use Media;

class Photo extends Model
{
    public function album()
    {
        return $this->belongsTo(Album::class);
    }

    public function media()
    {
        return $this->hasMany(Media::class, 'public_id', 'cloudinary_public_id');
    }
}
