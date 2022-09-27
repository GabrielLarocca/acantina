<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produto extends Model {

	protected $table = "produto";
	protected $fillable = [
		'pro_nome',
		'pro_imagem_id',
		'pro_descricao',
		'pro_preco',
		'pro_categoria',
		'pro_ativo',
	];

	public function photo() {
		return $this->belongsTo(Arquivo::class, 'pro_imagem_id');
	}
}
