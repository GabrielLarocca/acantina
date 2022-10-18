<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Categoria;

class CategoriaController extends Controller {

	public function list(Request $request) {
		return response()->json(Categoria::get());
	}
}
