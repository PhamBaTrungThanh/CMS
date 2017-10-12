<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'provider', 'provider_id', 'avatar'
    ];

    public function username()
    {
        return 'email';
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'provider_id',
    ];

	public function scopeFindOrCreate($query, $user, string $provider)
	{
		$find = self::where([
				['email', '=', $user->email],
				['provider_id', '=', $user->id],
			])->first();
		if (!$find) {
			$find = self::create([
            			'name' => $user->name,
            			'email' => $user->email,
            			'provider' => $provider,
            			'provider_id' => $user->id,
						'avatar' => $user->avatar_original,
        			]);
		}
		return $find;
	}
}
