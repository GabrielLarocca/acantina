<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Helpers\Utils;
use App\Models\Produto;
use Illuminate\Container\Container;
use Illuminate\Pagination\Paginator;

class ProdutosController extends Controller {

	public function list(Request $request) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'pro_category_id' => 'required',
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors], 422);
		}

		$produtos = Produto::where(["pro_active" => 1, "pro_category_id" => $request->pro_category_id])->orderBy('id', 'desc');

		$currentPage = $request->page + 1;
		$rows = 50;

		Paginator::currentPageResolver(function () use ($currentPage) {
			return $currentPage;
		});

		$produtos = $produtos->paginate($rows);

		return response()->json($produtos);
	}

	public function get(Request $request, $id) {
		return response()->json(Produto::where(["pro_active" => 1, "id" => $id])->firstOrFail());
	}
}
