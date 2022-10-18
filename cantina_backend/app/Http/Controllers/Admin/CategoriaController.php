<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Utils;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Categoria;
use App\Models\Produto;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CategoriaController extends Controller {

	public function listSimple(Request $request) {
		return response()->json(Categoria::where(['cat_ativo' => 1])->get());
	}

	public function list(Request $request) {
		$columnsToFilter = ['id', 'cat_name'];

		$wheres = array(
			'cat_ativo' => 1
		);

		return response()->json(["data" => Utils::createDataTableResult($request, Categoria::class, $wheres, $columnsToFilter)]);
	}

	public function store(Request $request) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'cat_name' => 'required',
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors]);
		}

		$obj = new Categoria();

		$obj->cat_name = $request->cat_name;
		$obj->cat_ativo = 1;

		$obj->save();

		return response()->json($obj);
	}

	public function destroy(Request $request, $id) {
		$obj = Categoria::where(['cat_ativo' => 1, 'id' => $id])->firstOrFail();

		$produtosComAcategoria = Produto::where(['pro_category_id' => $id])->get();

		if ($produtosComAcategoria->isEmpty()) {
			$obj->cat_ativo = 0;
			$obj->save();

			return response(null, 200);
		} else {
			return response()->json(['errors' => ["Você não pode remover uma categoria que contem produtos."]], 500);
		}
	}
}
