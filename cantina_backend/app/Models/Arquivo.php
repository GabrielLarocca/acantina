<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Helpers\S3Util;
use App\Helpers\Utils;

class Arquivo extends Model {

	protected $table = "files";
	protected $fillable = [
		'fil_name',
		'fil_size',
	];

	public $appends = ['url'];

	public function getUrlAttribute() {
		return Utils::getImage($this->fil_name);
	}
}
