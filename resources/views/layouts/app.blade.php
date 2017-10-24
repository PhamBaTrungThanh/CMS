<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title') - {{ config('app.name', 'Laravel') }}</title>

    <!-- Styles -->
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
</head>
<body id="frontend">
    <div id="app">
        <section id="sidebar" class="row vertical-direction hide-on-portrait">
            <div class="logo col fixed">
                @sprite(icon-logo)
            </div>
            <nav id="sidebar-menu" class="col fixed">
                <ul class="no-style">
                    <li>
                        <a href="{{route('frontend.index')}}">Home</a>
                    </li>
                    <li>
                        <a href="#">Random</a>
                    </li>
                    <li>
                        <a href="#">About me</a>
                    </li>
                    <li>
                        <a href="#">Contact</a>
                    </li>
                </ul>
            </nav>

            <p class="page-name heading">
                {{config('app.name')}}
            </p>
            <div class="stats col">

            </div>
            <div class="col fixed" id="loading-indicator">
                loading
            </div>
            <div class="facebook-contact col fixed">
                <a href="https://www.facebook.com/pg/mazui.photography/" target="_blank">
                    <span class="h6">Facebook</span>
                </a>
                <img src="http://graph.facebook.com/101037680514721/picture?width=200&type=square" alt="">
            </div>
        </section>
        <section id="content">
            <nav id="top-menu"></nav>
            <main>
                @yield('content')
            </main>
        </section>
    </div>

    <!-- Scripts -->

    <script src="{{ mix('js/app.js') }}"></script>
</body>
</html>
