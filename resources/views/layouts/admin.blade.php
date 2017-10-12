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
        <section role="siderbar">
            <header>
                <h3>{{config('app.name')}}</h3>
            </header>
            <main>
                <div role="userinfo">
                    <div class="avatar">
                    {{ auth()->user()->avatar }}
                    </div>
                    <div class="user text-center">
                        {{ auth()->user()->name }}
                    </div>
                </div>
            </main>

        </section>
        <section role="content">
            @yield('content')
        </section>

       
    </div>

    <!-- Scripts -->

    <script src="{{ mix('js/app.js') }}"></script>
</body>
</html>
