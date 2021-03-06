<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Photo;
use App\Models\Tag;
class Album extends Model
{
    protected $fillable = [
        'status',
    ];
    protected $casts = [
        'shot_at' => 'datetime',
    ];
    public function photos()
    {
        return $this->hasMany(Photo::class)->orderBy('order');
    }
    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}
