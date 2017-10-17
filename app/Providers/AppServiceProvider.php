<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Blade::directive('sprite', function($iconname) {
            return "<svg class=\"icon\"><use xlink:href=\"{{ mix('images/sprite.svg') }}#$iconname\" ></use></svg>";
        });

    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
        
    }
}

