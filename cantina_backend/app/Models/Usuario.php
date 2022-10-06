<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Auth\Passwords\CanResetPassword;
use App\Notifications\PasswordResetNotification;

class Usuario extends Authenticatable {

	use HasApiTokens, HasFactory, Notifiable, CanResetPassword;

	public function sendPasswordResetNotification($token) {
		$this->notify(new PasswordResetNotification($token));
	}

	protected $table = "users";
	protected $fillable = [
		'usu_name',
		'email',
		'password',
		'usu_id_photo',
		'usr_active',
		'remember_token'
	];
	protected $hidden = [
		'password',
		'remember_token',
	];

	public function photo() {
		return $this->belongsTo(Arquivo::class, 'usu_id_photo');
	}

	public function carrinho() {
		return $this->hasOne(Carrinho::class, 'car_user_id');
	}
}
