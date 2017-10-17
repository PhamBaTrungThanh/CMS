<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Album;
use App\Models\Media;

class Photo extends Model
{
    protected $casts = [
        'exif' => 'array',
    ];

    public function album()
    {
        return $this->belongsTo(Album::class);
    }

    public function media()
    {
        return $this->hasMany(Media::class, 'public_id', 'cloudinary_public_id');
    }

    public function getSrcSetAttribute($value)
    {
        $this->loadMissing('media');
        
        $srcset = [];
        foreach ($this->media as $media)
        {
            if ($media->type === "image")
            {
                $srcset[] = asset($media->url) . " {$media->width}w";
            }
        }
        return implode(", ", $srcset);
    }
    public function getThumbnailSrcAttribute($value)
    {
        $this->loadMissing('media');

        $srcset = [];
        foreach ($this->media as $media)
        {
            if ($media->type === "thumbnail")
            {
                $srcset[] = asset($media->url) . " {$media->width}w";
            }
        }
        return implode(", ", $srcset);
    }
}
