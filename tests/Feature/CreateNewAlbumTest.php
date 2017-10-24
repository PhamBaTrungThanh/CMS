<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CreateNewAlbumTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testCreate()
    {
        $response = $this->post(route('admin.album.create'), [
            'name' => "A Test Album",
            'description' => "Fake Album",
            'shot_at' => '2017-10-03',
            'tags' => "test,upate mode,chủ nhật, ",
            'cover' =>  UploadedFile::fake()->image('cover.jpg'),
        ]);
        $this->assertTrue(true);
    }
}
