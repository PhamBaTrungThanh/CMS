<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;


use App\Models\Photo;
use App\Models\Media;

class PhotoController extends Controller
{
    public function cloudinaryUploadCallback(Request $request)
    {
        $cloudinary_response = json_decode($request->getContent(), true);

        $photo = new Photo;
        $photo->cloudinary_public_id = $cloudinary_response['public_id'];
        $photo->name = $cloudinary_response['original_filename'];
        $photo->album_id = $cloudinary_response['context']['custom']['album_id'];
        $photo->ratio = (int) $cloudinary_response['width'] / (int) $cloudinary_response['height'];    
        $photo->order = Photo::where('album_id', $photo->album_id)->count() + 1;

        if (isset($cloudinary_response['exif'])) {
            $photo->exif = $cloudinary_response['exif'];
        } 

        $photo->save();

    }
    public function cloudinaryTransformCallback(Request $request)
    {
        $cloudinary_response = json_decode($request->getContent(), true);

        $multimedia = array();
        $photo = Photo::where('cloudinary_public_id', $cloudinary_response['public_id'])->first();
        $client = new \GuzzleHttp\Client();
        $transformations = $cloudinary_response['eager'];
        $last_unit = array(
            "width" => 0,
            "height" => 0,
            "bytes" => 0,
        );
        foreach ($transformations as $key => $transform) {
            $current_unit = array(
                "width" => $transform['width'],
                "height" => $transform['height'],
                "bytes" => $transform['bytes'],
            );
            if (count(array_diff($last_unit, $current_unit)) !== 0) {
                $res = $client->request('GET', $transform['url']);
                
                $custom_name = str_random(22). ".jpg";
    
                Storage::put("{$photo->album_id}/{$custom_name}", $res->getBody());
    
    
                $media = array(
                    'format' => 'image',
                    'width' => $transform['width'],
                    'height' => $transform['height'],
                    'bytes' => $transform['bytes'],
                    'original_url' => $transform['url'],
                    'url' => "{$photo->album_id}/{$custom_name}",
                );
                $last_unit = $current_unit;
                array_push($multimedia, $media);
            }
        }

        $photo->media()->createMany($multimedia);
    }
}
