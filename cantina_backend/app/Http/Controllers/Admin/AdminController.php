<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use App\Helpers\Utils;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller {
	public function list(Request $request) {
		$columnsToFilter = ['adm_name'];

		$wheres = array(
			'adm_active' => 1
		);

		return response()->json(["data" => Utils::createDataTableResult($request, Admin::class, $wheres, $columnsToFilter)]);
	}

	public function get(Request $request, $id) {
		return response()->json(Admin::where(["adm_active" => 1, "id" => $id])->firstOrFail());
	}

	public function store(Request $request) {
		$this->validate($request, [
			'adm_id_group' => 'required',
			'adm_name' => 'required',
			'email' => 'required|email|unique:admins',
			'password' => 'required|min:6'
		]);

		$obj = new Admin;

		$obj->adm_id_group = $request->adm_id_group;
		$obj->adm_name = $request->adm_name;
		$obj->email = $request->email;
		$obj->password = bcrypt($request->password);
		$obj->adm_active = 1;

		$obj->save();

		return response()->json($obj);
	}

	public function update(Request $request, $id) {
		$this->validate($request, [
			'adm_id_group' => 'required',
			'adm_name' => 'required'
		]);

		$obj = Admin::where(['adm_active' => 1, 'id' => $id])->firstOrFail();

		if (!empty($request->password)) {
			if (strlen($request->password) < 6) {
				return response()->json(['errors' => ["The password field minimum length is 6 characters."]]);
			}

			$obj->password = bcrypt($request->password);
		}

		$obj->adm_id_group = $request->adm_id_group;
		$obj->adm_name = $request->adm_name;

		$obj->save();

		return response()->json($obj);
	}


	public function destroy(Request $request, $id) {
		$obj = Admin::where(['adm_active' => 1, 'id' => $id])->firstOrFail();

		$obj->adm_active = 0;
		$obj->save();

		return response(null, 200);
	}
}
