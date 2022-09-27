<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Helpers\S3Util;

class Arquivo extends Model {

	protected $table = "arquivo";
	protected $fillable = [
		'arq_nome',
		'arq_tamanho'
	];
	public $appends = ['url'];

	public function getUrlAttribute() {
		return S3Util::getObject($this->arq_nome);
	}
}
