<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Photo;
class Media extends Model
{
    public function photo()
    {
        return $this->belongsTo(Photo::class, 'cloudinary_public_id', 'public_id');
    }
}
