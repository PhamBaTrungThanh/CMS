@extends('layouts.app')
@section('title', 'Đăng nhập')
@section('content')
<div class="wrapper viewport login-container login-background">
	
	<div class="row full-height align-center justify-center">
		<div class="col fixed login-section">
			<h1 class="text-center login-title">Đăng nhập</h1>
			<div class="box z-depth-2 login-box">
				<div class="login-box--inside">
					
					<p class="text-center h5">
						@if (request()->has('continue'))
							Xin mời bạn đăng nhập để tiếp tục
						@else
							Chào mừng bạn đến với {{ config('app.name') }}
						@endif
					</p>
					<p class="text-center">
						<a href="#" class="facebook-login flex align-center">
							<svg aria-labelledby="simpleicons-facebook-icon" role="img" with="30" height="30" style="fill: #ffffff;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title id="simpleicons-facebook-icon">Facebook icon</title><path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.408.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.097 2.796.141v3.24h-1.921c-1.5 0-1.792.721-1.792 1.771v2.311h3.584l-.465 3.63H16.56V24h6.115c.733 0 1.325-.592 1.325-1.324V1.324C24 .593 23.408 0 22.676 0"/></svg>
							<span class="heading h6">Đăng nhập bằng <strong>Facebook</strong></span>
						</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
@endsection
