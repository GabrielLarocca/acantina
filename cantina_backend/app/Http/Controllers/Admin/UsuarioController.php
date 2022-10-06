<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Utils;
use App\Models\Carrinho;
use App\Models\Usuario;
use Illuminate\Support\Facades\Validator;

class UsuarioController extends Controller {
	public function list(Request $request) {
		$columnsToFilter = ['usr_name', 'email'];

		$wheres = array(
			'usr_active' => 1
		);

		return response()->json(["data" => Utils::createDataTableResult($request, Usuario::class, $wheres, $columnsToFilter)]);
	}

	public function get(Request $request, $id) {
		return response()->json(Usuario::where(["usr_active" => 1, "id" => $id])->with('carrinho.produtos')->firstOrFail());
	}

	public function store(Request $request) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'usr_name' => 'required',
			'email' => 'required',
			'password' => 'required'
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors]);
		}

		$obj = new Usuario();

		$obj->usr_name = $request->usr_name;
		$obj->email = $request->email;
		$obj->password = bcrypt($request->password);
		$obj->usr_active = 1;

		$obj->save();

		$cart = new Carrinho();

		$cart->car_user_id = $obj->id;

		$cart->save();

		return response()->json($obj);
	}

	public function update(Request $request, $id) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'usr_name' => 'required',
			'email' => 'required',
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors]);
		}

		$obj = Usuario::where(['usr_active' => 1, 'id' => $id])->firstOrFail();

		$obj->usr_name = $request->usr_name;
		$obj->email = $request->email;

		if ($request->password) {
			$obj->password = bcrypt($request->password);
		}


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
		$obj = Usuario::where(['usr_active' => 1, 'id' => $id])->firstOrFail();

		$obj->usr_active = 0;
		$obj->save();

		return response(null, 200);
	}
}
