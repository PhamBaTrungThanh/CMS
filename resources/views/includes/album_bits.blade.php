
    
    @if (str_contains($album->class, "latest"))
        <a href="{{ route('frontend.album.show', ['album_slug' => $album->slug]) }}" class="album-bits {{$album->class}}">
            <img src="{{ asset('storage/' . $album->cover) }}" alt="">
        </a>
        <div class="extra-info">
            <div class="content row">
                <div class="tags col">
                    @foreach ($album->tags as $tag)
                        {{ $tag->name }}
                    @endforeach
                </div>
                <div class="text-center col stats fixed shot-at">
                    <h2 class="count">
                        {{$album->shot_at->format('d/m/y')}}
                    </h2>
                    <span class="text">
                        Ngày chụp
                    </span>
                </div> 
                <div class="text-center col stats view-counts fixed">
                    <h2 class="count">
                        {{$album->view_count}}
                    </h2>
                    <span class="text">
                        Lượt xem
                    </span>

                </div>
                <div class="text-center col stats fixed like-counts">
                    <h2 class="count">
                        {{$album->like_count}}
                    </h2>
                    <span class="text">
                        Yêu thích
                    </span>
                </div>              
                <div class="col fixed goto-album">
                <a href="{{ route('frontend.album.show', ['album_slug' => $album->slug]) }}">Xem Album</a>
                </div>         
            </div>
        </div>
    @else
    <a href="{{ route('frontend.album.show', ['album_slug' => $album->slug]) }}" class="album-bits {{$album->class}}">
        <img src="{{ asset('storage/' . $album->cover) }}" alt="">
    </a>
    @endif
