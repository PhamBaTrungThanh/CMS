<a href="{{ route('frontend.album.show', ['album_slug' => $album->slug]) }}" class="album-bits {{$album->class}}">
    
    @if (str_contains($album->class, "latest"))
        <div class="blurred-background" style="background-image: url({{ asset('storage/' . $album->cover) }})"></div>
        <img src="{{ asset('storage/' . $album->cover) }}" alt="" class="background">
        <div class="extra-info">
            <div class="content">
                <div class="tags">
                    @foreach ($album->tags as $tag)
                        {{ $tag->name }}
                    @endforeach
                </div>
            </div>

        </div>
    @else
        <img src="{{ asset('storage/' . $album->cover) }}" alt="">
    @endif
</a>