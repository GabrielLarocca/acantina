<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produto extends Model {

	protected $table = "products";
	protected $fillable = [
		'pro_name',
		'pro_image_id',
		'pro_description',
		'pro_price',
		'pro_category_id',
		'pro_active',
	];

	public function photo() {
		return $this->belongsTo(Arquivo::class, 'pro_image_id');
	}
}
