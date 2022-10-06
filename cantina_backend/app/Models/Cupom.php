<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Helpers\S3Util;

class Cupom extends Model {

	protected $table = "coupons";
	protected $fillable = [
		'cou_code',
		'cou_discount',
		'cou_description',
		'cou_initial_date',
		'cou_finish_date',
		'active',
	];
}
