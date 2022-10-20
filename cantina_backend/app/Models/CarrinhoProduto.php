<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarrinhoProduto extends Model {

	protected $table = "cart_products";
	protected $fillable = [
		'id',
		'quantity',
		'cart_id',
		'product_id',
	];

	public function carrinho() {
		return $this->belongsTo(Carrinho::class, 'cart_id');
	}

	public function produto() {
		return $this->belongsTo(Produto::class, 'product_id');
	}
}
