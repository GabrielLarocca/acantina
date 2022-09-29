<?php

namespace App\Models;

use App\Notifications\PasswordResetNotification;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable {
	use HasApiTokens, HasFactory, Notifiable;

	protected $table = "admins";
	protected $fillable = [
		'adm_name',
		'adm_email',
		'adm_password',
	];

	protected $hidden = [
		'adm_password',
	];
}
