<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Helpers\S3Util;

class Categoria extends Model {

	protected $table = "category";
	protected $fillable = [
		'id',
		'cat_name',
	];

	public function produto() {
		return $this->belongsTo(Produto::class, 'car_user_id');
	}
}
