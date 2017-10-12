<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

	public function index()
	{
		$continue = (request()->has('continue')) ? request()->input('continue') : session()->get("_previous")['url'];
		return view('login.index')->withContinue($continue);
	}
	public function success()
	{
		$continue = request()->input('continue');
		$agent = new Agent;
		return view('login.success')->withIsDesktop($agent->isDesktop())->withContinue($continue);
		
	}
	public function redirectToProvider(string $provider)
	{
		$continue = request()->input('continue');
		return Socialite::driver($provider)->with(['state' => json_encode(['continue' => $continue])])->redirect();
	}
    public function handleProviderCallback(string $provider)
    {
		$state = json_decode(request()->input('state'), true);
		
        $social_user = Socialite::driver($provider)->stateless()->user();
		$user = User::findOrCreate($social_user, $provider);
		Auth::login($user);
		
		return redirect()->intended(route('login.success', ['continue' => $state['continue']]));
 
    }
}

