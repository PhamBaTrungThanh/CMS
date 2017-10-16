<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePhotosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('photos', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->integer('album_id');
            $table->string('cloudinary_public_id');
            $table->text('description')->nullable();
            $table->double('ratio', 15, 13);
            $table->json('exif')->nullable();
            $table->bigInteger('views_count')->default(0);
            $table->bigInteger('downloads_count')->default(0);    
			$table->bigInteger('likes_count')->default(0); 
			$table->bigInteger('shares_count')->default(0);
            $table->boolean('disable_download')->default(false);
            $table->boolean('disable_comments')->default(false); 
            $table->boolean('hide_exif')->default(false);  
			$table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('photos');
    }
}
