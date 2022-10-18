<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Helpers\Utils;
use App\Models\Carrinho;
use App\Models\CarrinhoProduto;
use App\Models\Categoria;
use App\Models\User;
use Illuminate\Container\Container;

class CategoriaController extends Controller {

	public function list(Request $request) {
		return response()->json(Categoria::where(['cat_ativo' => 1])->get());
	}
}
