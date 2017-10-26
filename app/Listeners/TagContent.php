<?php

namespace App\Listeners;

use App\Events\TaggingContent;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\DB;
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
        $new_ids = [];
        foreach ($unique_tags as $tag) {
            $new_tag = new Tag;
            $new_tag->name = $tag['name'];
            $new_tag->slug = $tag['slug'];
            $new_tag->save();
            $new_ids[] = $new_tag->id;
        }
        
        $mer = $ids->merge($new_ids);
        
        $taxonomies = [];

        foreach ($mer as $id) {
            $taxonomies[] = ['tag_id' => $id, 'taggable_type' => $event->model, 'taggable_id' => $event->content_id];
        }

        DB::table('taggables')->insert($taxonomies);
    }
}
