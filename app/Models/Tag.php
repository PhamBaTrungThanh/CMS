<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Taggable;

class Tag extends Model
{
    protected $fillable = [
        'name',
        'slug',
    ];

    public function taggables()
    {
        return $this->hasMany(Taggable::class);
    }
}
