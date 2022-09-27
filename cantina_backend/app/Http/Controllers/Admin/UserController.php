<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Helpers\Utils;
use Illuminate\Support\Facades\Log;

class UserController extends Controller {
	public function list(Request $request) {
		$columnsToFilter = ['usr_name',  'email', 'usr_type'];

		$wheres = array(
			'usr_active' => 1
		);

		return response()->json(["data" => Utils::createDataTableResult($request, User::class, $wheres, $columnsToFilter)]);
	}

	public function get(Request $request, $id) {
		return response()->json(User::where(["usr_active" => 1, "id" => $id])->with(['exercises'])->firstOrFail());
	}

	public function destroy(Request $request, $id) {
		$obj = User::where(['usr_active' => 1, 'id' => $id])->firstOrFail();

		$obj->usr_active = 0;
		$obj->save();

		return response(null, 200);
	}
}
