<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Helpers\S3Util;

class Cupom extends Model {

	protected $table = "cupom";
	protected $fillable = [
		'cup_codigo',
		'cup_desconto',
		'cup_descricao',
		'cup_data_inicial',
		'cup_data_final',
		'cup_ativo',

	];

	public function photo() {
		return $this->belongsTo(Arquivo::class, 'pro_imagem_id');
	}
}
