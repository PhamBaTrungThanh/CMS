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
<body>
    <div id="app">
        <section role="sidebar">
            <header class="site-name text-center">
                <span class="h4">{{config('app.name')}}</span>
            </header>
            <main>
                <div role="userinfo">
                    <div class="avatar">
                        <img src="http://graph.facebook.com/1847481919/picture?width=200&type=square" alt="">
                    </div>
                    <div class="logout-link">
                        <svg class="fit" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"  x="0px" y="0px" viewBox="0 0 490.3 490.3" style="enable-background:new 0 0 490.3 490.3;" xml:space="preserve" width="512px" height="512px">
                            <g>
                                <g>
                                    <path d="M0,121.05v248.2c0,34.2,27.9,62.1,62.1,62.1h200.6c34.2,0,62.1-27.9,62.1-62.1v-40.2c0-6.8-5.5-12.3-12.3-12.3    s-12.3,5.5-12.3,12.3v40.2c0,20.7-16.9,37.6-37.6,37.6H62.1c-20.7,0-37.6-16.9-37.6-37.6v-248.2c0-20.7,16.9-37.6,37.6-37.6h200.6    c20.7,0,37.6,16.9,37.6,37.6v40.2c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-40.2c0-34.2-27.9-62.1-62.1-62.1H62.1    C27.9,58.95,0,86.75,0,121.05z" fill="#FFFFFF"/>
                                    <path d="M385.4,337.65c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l83.9-83.9c4.8-4.8,4.8-12.5,0-17.3l-83.9-83.9    c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l63,63H218.6c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h229.8l-63,63    C380.6,325.15,380.6,332.95,385.4,337.65z" fill="#FFFFFF"/>
                                </g>
                            </g>
                        </svg>
                    </div>

                    <div class="user text-center">
                        <span>{{ auth()->user()->name }}</span>
                    </div>
                </div>
                <div class="sections">
                    
                </div>
            </main>

        </section>
        <section role="content">
            <header class="breadcumb">
                <span class="parent">
                    @php
                        echo title_case(explode('.', str_after(Route::currentRouteName(), 'admin.'))[0]);
                    @endphp
                </span>
                <span class="current">
                    @yield('title')
                </span>
            </header>
            @yield('content')
        </section>

       
    </div>

    <!-- Scripts -->

    <script src="{{ mix('js/app.js') }}"></script>
</body>
</html>
