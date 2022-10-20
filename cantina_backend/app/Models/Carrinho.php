<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carrinho extends Model {

	protected $table = "cart";
	protected $fillable = [
		'id',
		'car_user_id',
	];

	public function usuario() {
		return $this->belongsTo(Usuario::class, 'car_user_id');
	}

	public function produtos() {
		return $this->hasMany(CarrinhoProduto::class, 'cart_id');
	}
}
