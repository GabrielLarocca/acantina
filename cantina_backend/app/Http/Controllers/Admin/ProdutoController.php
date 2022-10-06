<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use App\Helpers\Utils;
use App\Models\Produto;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ProdutoController extends Controller {
	public function list(Request $request) {
		$columnsToFilter = ['pro_name', 'pro_price'];

		$wheres = array(
			'pro_active' => 1
		);

		return response()->json(["data" => Utils::createDataTableResult($request, Produto::class, $wheres, $columnsToFilter)]);
	}

	public function get(Request $request, $id) {
		return response()->json(Produto::where(["pro_active" => 1, "id" => $id])->with('categoria')->firstOrFail());
	}

	public function store(Request $request) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'pro_name' => 'required',
			'pro_description' => 'required',
			'pro_price' => 'required',
			'pro_category_id' => 'required'
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors]);
		}

		$obj = new Produto();

		$obj->pro_name = $request->pro_name;
		$obj->pro_description = $request->pro_description;
		$obj->pro_price = $request->pro_price;
		$obj->pro_category_id = $request->pro_category_id;
		$obj->pro_active = 1;

		/*if ($request->file('photo') != null) {
			$attachment = Utils::addAttachment($request->file('photo'));

			$obj->pro_image_id = $attachment->id;
		}*/

		$obj->save();

		return response()->json($obj);
	}

	public function update(Request $request, $id) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'pro_name' => 'required',
			'pro_description' => 'required',
			'pro_price' => 'required'
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors]);
		}

		$obj = Produto::where(['pro_active' => 1, 'id' => $id])->firstOrFail();

		$obj->pro_name = $request->pro_name;
		$obj->pro_description = $request->pro_description;
		$obj->pro_price = $request->pro_price;

		/*if ($request->file('photo') != null) {
			$this->validate($request, [
				'photo' => 'required|image|mimes:jpeg,png,jpg|max:1024',
			]);

			$attachment = Utils::addAttachment($request->file('photo'));

			$obj->pro_image_id = $attachment->id;
		}*/

		$obj->save();

		return response()->json($obj);
	}

	public function destroy(Request $request, $id) {
		$obj = Produto::where(['pro_active' => 1, 'id' => $id])->firstOrFail();

		$obj->pro_active = 0;
		$obj->save();

		return response(null, 200);
	}
}
