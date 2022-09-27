<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Helpers\S3Util;

class Carrinho extends Model {

	protected $table = "carrinho";
	protected $fillable = [
		'car_usuario_id',
	];

	public function usuario() {
		return $this->belongsTo(Usuario::class, 'car_usuario_id');
	}
}
