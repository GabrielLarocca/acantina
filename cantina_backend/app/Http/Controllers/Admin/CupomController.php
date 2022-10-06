<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use App\Helpers\Utils;
use App\Models\Cupom;
use App\Models\Produto;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CupomController extends Controller {
	public function list(Request $request) {
		$columnsToFilter = ['cou_discount', 'cou_initial_date', 'cou_finish_date'];

		$wheres = array(
			'active' => 1
		);

		return response()->json(["data" => Utils::createDataTableResult($request, Cupom::class, $wheres, $columnsToFilter)]);
	}

	public function get(Request $request, $id) {
		return response()->json(Cupom::where(["active" => 1, "id" => $id])->firstOrFail());
	}

	public function store(Request $request) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'cou_code' => 'required',
			'cou_discount' => 'required',
			'cou_description' => 'required',
			'cou_initial_date'  => 'required',
			'cou_finish_date'  => 'required',
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors]);
		}

		$obj = new Cupom();

		$obj->cou_code = $request->cou_code;
		$obj->cou_discount = $request->cou_discount;
		$obj->cou_description = $request->cou_description;
		$obj->cou_initial_date = $request->cou_initial_date;
		$obj->cou_finish_date = $request->cou_finish_date;
		$obj->active = 1;

		$obj->save();

		return response()->json($obj);
	}

	public function update(Request $request, $id) {
		//faz sentido?
		$errors = array();

		$validator = Validator::make($request->all(), [
			'cou_code' => 'required',
			'cou_discount' => 'required',
			'cou_description' => 'required',
			'cou_initial_date'  => 'required',
			'cou_finish_date'  => 'required',
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors]);
		}

		$obj = Cupom::where(['active' => 1, 'id' => $id])->firstOrFail();

		$obj->cou_code = $request->cou_code;
		$obj->cou_discount = $request->cou_discount;
		$obj->cou_description = $request->cou_description;
		$obj->cou_initial_date = $request->cou_initial_date;
		$obj->cou_finish_date = $request->cou_finish_date;

		$obj->save();

		return response()->json($obj);
	}

	public function destroy(Request $request, $id) {
		$obj = Cupom::where(['active' => 1, 'id' => $id])->firstOrFail();

		$obj->active = 0;
		$obj->save();

		return response(null, 200);
	}
}
