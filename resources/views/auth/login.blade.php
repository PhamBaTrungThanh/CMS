<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Đăng nhập - {{ config('app.name', 'Laravel') }}</title>

    <!-- Styles -->
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
<body id="login">
<div class="wrapper viewport login-container login-background">
	
	<div class="row full-height align-center justify-center">
		<div class="col fixed login-section">
			<h1 class="text-center login-title">Đăng nhập</h1>
			<div class="z-depth-2 login-box">
				<div class="login-box--inside">	
					<svg class="site-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 211.59 148.77"><defs><style>.cls-1,.cls-3{stroke:#fff;stroke-miterlimit:10;}.cls-2{font-size:43.12px;font-family:RobotoCondensed-Light, Roboto Condensed;}.cls-3{fill:none;stroke-width:2px;}</style></defs><title>Asset 1</title><g id="Layer_2" data-name="Layer 2"><g id="base"><path class="cls-1" d="M207.73,48.81c-.78-2.74-1.46-5.52-2.37-8.21-3.56-10.55-13.08-17.66-23.7-17.7-17-.05-34-.1-51,0-11.57,0-14.74,2.18-18,13.42-8.15,28.26-16,56.62-24,84.91a98,98,0,0,1-5.21,14.43c-3.44,7.39-9.35,12-17.68,12.22-12.41.31-24.88.82-37.23,0C12.29,146.65.8,133.76.65,117.47Q.34,83,.67,48.6C.84,31.31,13.61,18.3,30.8,17.92c14.85-.33,29.71-.28,44.56,0,13.8.25,22.69,7.74,23.09,18.9,0,1.16-.5,2.35-1.22,5.41-1.8-2.85-3.15-4.1-3.41-5.56-1.69-9.39-8.21-13.32-16.68-13.59-15.92-.5-31.88-.68-47.79,0C15.78,23.6,5.76,34.52,5.61,48.15q-.39,34.84,0,69.68c.16,14,11,24.79,25.38,25.44,10.51.47,21.06.21,31.59.11,10.12-.09,15.92-6,18.67-15.06,4.61-15.23,9-30.55,13.31-45.86q6.63-23.36,13-46.78c2.91-10.58,8.29-17.81,20.61-18.2,2.17-.07,5.27-4.77,6.06-7.82,1.8-7,5.3-9.92,12.55-8.74a34.9,34.9,0,0,0,10.51,0c10.62-1.57,18.3.62,20.14,13,.24,1.63,4.07,3.53,6.47,3.92,13.64,2.21,24.1,11,26.9,23.59.53,2.37.08,5,.08,7.44ZM172.1,17.41c-.08-9.06-4.21-12.88-13-11.56a27.92,27.92,0,0,1-8,0C142.38,4.58,138,8.17,138,17.41Z"/><path d="M120.19,81.61a34.59,34.59,0,0,1,35-34.7c19.13.07,35.13,16.13,35,35.1-.15,19.23-16,35.18-35,35.15C135.29,117.13,120,101.61,120.19,81.61ZM155.35,52a30.07,30.07,0,0,0-30.53,30.1c0,16.24,13.65,30.08,29.79,30.19A30.15,30.15,0,1,0,155.35,52Z"/><path d="M210.93,116.93c0,2.51.46,5.12-.08,7.51C208,137,197.21,147.21,184,147.72a571.9,571.9,0,0,1-57.43-.26c-16.28-1-27.47-15-26-32.24,2,2.94,3.59,4.31,4.07,6,4.32,15.09,13.12,22.09,28.66,22.21,14,.11,28.08,0,42.11,0,18.92-.08,26.82-6.28,31.51-24.53a6.83,6.83,0,0,1,1.26-1.86Z"/><path d="M175.45,84c1.25,11.22-7.37,19.87-18.18,20.91-12.2,1.18-22.64-6.65-22.66-18.3,4.91,8.18,10.84,14.83,21.05,14.51C165.65,100.84,170.78,93.73,175.45,84Z"/></g><g id="text"><text class="cls-2" transform="translate(32.35 70.95)">M</text><text class="cls-2" transform="translate(36.88 119.86)">Z</text><line class="cls-3" x1="27.11" y1="80.39" x2="69.7" y2="80.39"/></g></g></svg>
					<h3 class="text-center">{{ config('app.name') }}</h3>
					<form method="post" class="box">					
						<div class="form-unit">
							<input class="form-control" type="text" name="email" id="email" placeholder="Email" tabindex="1"/>
						</div>
						<div class="form-unit">
							<input class="form-control" type="password" name="password" id="password" placeholder="Mật khẩu"/>
						</div>
						<div class="form-unit text-center">
							{{ csrf_field() }}
							<input type="submit" value="Đăng nhập" class="btn">						
						</div>

					</form>
					<p class="text-center">
						<a href="#" class="facebook-login flex align-center">
							<svg aria-labelledby="simpleicons-facebook-icon" role="img" with="30" height="30" style="fill: #ffffff;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title id="simpleicons-facebook-icon">Facebook icon</title><path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.408.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.097 2.796.141v3.24h-1.921c-1.5 0-1.792.721-1.792 1.771v2.311h3.584l-.465 3.63H16.56V24h6.115c.733 0 1.325-.592 1.325-1.324V1.324C24 .593 23.408 0 22.676 0"/></svg>
							<span class="heading h6">Đăng nhập bằng <strong>Facebook</strong></span>
						</a>
					</p>
				</div>
				<div class="login-box--inside background-primary box">
					<h5 class="text-center text-color-light">
						
					</h5>	
					
				</div>
			</div>

		</div>
	</div>
</div>	

</body>
</html>