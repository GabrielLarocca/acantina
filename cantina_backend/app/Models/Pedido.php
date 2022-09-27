<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Helpers\S3Util;

class Pedido extends Model {

	protected $table = "pedido";
	protected $fillable = [
		'ped_cupom_id',
		'ped_data_retirada',
		'ped_carrinho_id',
		'ped_total',
		'ped_usuario_id',
		'ped_estado_pagamento',
		'ped_estado_producao'

	];

	public function usuario() {
		return $this->belongsTo(Usuario::class, 'ped_usuario_id');
	}

	public function carrinho() {
		return $this->belongsTo(Carrinho::class, 'ped_carrinho_id');
	}

	public function cupom() {
		return $this->belongsTo(Cupom::class, 'ped_cupom_id');
	}
}
