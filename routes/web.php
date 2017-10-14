<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Auth::routes();
Route::namespace('Auth')->group(function() {
    Route::get('/login/{provider}', 'LoginController@redirectToProvider')->name('login.facebook');
    Route::get('/login/{provider}/callback', 'LoginController@handleProviderCallback');
    Route::get('/login/success', 'LoginController@success')->middleware('auth')->name('login.success');
});

Route::get('/home', 'HomeController@index')->name('home');


Route::namespace('Admin')->as('admin.')->middleware(['auth', 'admin'])->prefix('admin')->group( function() {
    Route::get('/', 'DashboardController@index')->name('dashboard');
    Route::as('album.')->prefix('album')->group(function() {
        Route::get('/create', 'AlbumController@create')->name('create');
        Route::get('/{album}', 'AlbumController@show')->name('show');
        Route::post('', 'AlbumController@store')->name('store');
    });
});