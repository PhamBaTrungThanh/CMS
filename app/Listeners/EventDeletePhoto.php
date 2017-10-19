<?php

namespace App\Listeners;

use App\Events\RequestDeletePhoto;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Storage;

class EventDeletePhoto
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  RequestDeletePhoto  $event
     * @return void
     */
    public function handle(RequestDeletePhoto $event)
    {
        foreach($event->photo->media as $media) {
            Storage::delete(str_after($media->url, "storage/"));
            
        } 
        $event->photo->media()->delete();
        $event->photo->delete();
    }
}
