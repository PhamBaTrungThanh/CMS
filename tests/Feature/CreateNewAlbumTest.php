<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\WithoutMiddleware;

class CreateNewAlbumTest extends TestCase
{
    use RefreshDatabase, WithoutMiddleware;
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testCreate()
    {
        $response = $this->post(route('admin.album.store'), [
            'name' => "A Test Album",
            'description' => "Fake Album",
            'shot_at' => '2017-10-03',
            'tags' => "test,upate mode,chủ nhật, ",
            'cover' =>  UploadedFile::fake()->image('cover.jpg'),
            '_token' => csrf_token(),
        ]);


        $this->assertDatabaseHas('albums', [
            'name' => "A Test Album",
        ]);
        $this->assertDatabaseHas('tags', [
            'name' => "Test",
            "slug" => "test",
        ]);
        $this->assertDatabaseHas('taxonomies', [
            'tag_id' => 1,
            'taxable_id' => 1
        ]);
    }
}
