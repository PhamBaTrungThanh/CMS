@extends('layouts.admin')
@section('title', 'Dashboard')
@section('content')
    <div class="row">
        <div class="col">
            <a href="#" class="z-depth-1 text-center dashboard-card">
                <span class="display-3 large-icon">
                    @sprite(icon-albums-color)
                </span>
                <h3>Create new album</h3>
            </a>
        </div>
        <div class="col">
            <a href="#" class="z-depth-1 text-center dashboard-card">
                <span class="display-3 large-icon">
                    @sprite(icon-edit-color)
                </span>
                <h3>Write a post</h3>
            </a>
        </div>
        <div class="col">
            <a href="#" class="z-depth-1 text-center dashboard-card">
                <span class="display-3 large-icon">
                    @sprite(icon-settings-color)
                </span>
                <h3>Settings</h3>
            </a>
        </div>
    </div>
@endsection