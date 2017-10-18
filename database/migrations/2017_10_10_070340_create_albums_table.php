<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAlbumsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('albums', function (Blueprint $table) {
            $table->increments('id');
			$table->string('name');
			$table->string('slug');
			$table->string('description')->nullable();
            $table->bigInteger('views_count')->default(0);
			$table->bigInteger('likes_count')->default(0);
			$table->bigInteger('shares_count')->default(0);
            $table->timestamps();
            $table->string('status')->default('finished');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('albums');
    }
}
