<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
