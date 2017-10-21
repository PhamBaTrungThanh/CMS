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
        Route::get('/{album_id}', 'AlbumController@show')->name('show');
        Route::get('/{album}/add', 'AlbumController@add')->name('add');
        Route::get("", 'AlbumController@index')->name('index');
        
        Route::post('{album}', 'AlbumController@update')->name('update');
        Route::post('', 'AlbumController@store')->name('store');
       
    });
});

Route::namespace('Frontend')->as('frontend.')->group(function() {
    Route::get('', 'HomeController@index')->name('index');
});
// Unprotected callback route

Route::prefix('callback')->name('callback.')->group( function() {
    Route::post('/admin/photo/upload', 'Admin\PhotoController@cloudinaryUploadCallback')->name('cloudinary_serive.upload');
    Route::post('/admin/photo/transform', 'Admin\PhotoController@cloudinaryTransformCallback')->name('cloudinary_serive.transform');
});