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

Route::get('/', function () {
    return view('welcome');
});


Auth::routes();
Route::get('/login/{provider}', 'LoginController@redirectToProvider')->name('login.facebook');
Route::get('/login/{provider}/callback', 'LoginController@handleProviderCallback');
Route::get('/login/success', 'LoginController@success')->middleware('auth')->name('login.success');


Route::get('/home', 'HomeController@index')->name('home');
