<?php

namespace App\Listeners;

use App\Events\TaggingContent;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

use App\Models\Tag;

class TagContent
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
     * @param  TaggingContent  $event
     * @return void
     */
    public function handle(TaggingContent $event)
    {
        $tags = collect(explode(",", trim($event->tags)))->reject(function($tag) {
            return ($tag == null);
        })->map(function($tag) {
            return ['slug' => str_slug($tag), 'name' => title_case($tag)];
        });

        // first we query all the related model with slug

        $tag_models = Tag::whereIn('slug', $tags->pluck('slug'))->get();
        $ids = $tag_models->pluck('id');
        // then we compare $slugs and the queried to get all the new one

        $unique_tags = $tags->whereNotIn('slug', $tag_models->pluck('slug'));
        // create new models with those tag
        //$new_ids = Tag::create($unique_tags->toArray())->pluck('id');
        $new_ids = $unique_tags->map(function($tag) {
            return Tag::create($tag)->pluck('id');
        });
        $mer = $ids->merge($new_ids)->map(function($id) {
            return ['tag_id' => $id, 'taxable_type' => $event->model, 'taxable_id' => $event->content_id];
        });
        $mer->dd();
        DB::table('taxomonies')->insert($mer);
    }
}
