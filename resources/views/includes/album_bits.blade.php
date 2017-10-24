<a href="{{ route('frontend.album.show', ['album_slug' => $album->slug]) }}" class="album-bits {{$album->class}}">
    <img src="{{ asset('storage/' . $album->cover) }}" alt="">
</a>