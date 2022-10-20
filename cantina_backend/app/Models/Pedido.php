<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model {

	protected $table = "order";
	protected $fillable = [
		'ord_cupom_id',
		'ord_withdrawal_date',
		'ord_cart_id',
		'ord_total',
		'ord_user_id',
		'ord_state_payment',
		'ord_state_order',
		'ord_nf'
	];

	public function usuario() {
		return $this->belongsTo(Usuario::class, 'ord_user_id');
	}

	public function carrinho() {
		return $this->belongsTo(Carrinho::class, 'ord_cart_id');
	}

	public function cupom() {
		return $this->belongsTo(Cupom::class, 'ord_cupom_id');
	}
}
