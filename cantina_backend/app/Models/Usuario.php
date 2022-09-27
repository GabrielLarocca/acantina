<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Auth\Passwords\CanResetPassword;
use App\Notifications\PasswordResetNotification;

class Usuario extends Authenticatable {

	use HasApiTokens,
		HasFactory,
		Notifiable,
		CanResetPassword;

	public function sendPasswordResetNotification($token) {
		$this->notify(new PasswordResetNotification($token));
	}

	protected $table = "usuario";
	protected $fillable = [
		'usu_nome',
		'usu_email',
		'usu_senha',
		'usu_id_foto',
		'usu_ativo',
		'remember_token'
	];
	protected $hidden = [
		'usu_senha',
		'remember_token',
	];

	public function photo() {
		return $this->belongsTo(Arquivo::class, 'usu_id_foto');
	}
}
