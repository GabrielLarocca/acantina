<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\GroupPermission;
use Illuminate\Support\Facades\Route;
use App\Helpers\Utils;

class GroupController extends Controller {
	private function getPermissionsList() {
		$controllers = [];

		foreach (Route::getRoutes()->getRoutes() as $route) {
			$action = $route->getAction();

			if (array_key_exists('controller', $action)) {
				if (strpos($action['controller'], "App\Http\Controllers\Admin") === 0) {
					$controllers[] = explode('@', $action['controller']);
				}
			}
		}

		return $controllers;
	}

	public function givePermissionsLocally(Request $request) {
		if (config("app.env") === "local") {
			$group = Group::where(['gro_active' => 1, 'id' => auth()->user()->adm_id_group])->with('permissions')->firstOrFail();

			foreach ($group->permissions as $perm) {
				$perm->delete();
			}

			foreach ($this->getPermissionsList() as $perm) {
				$obj = new GroupPermission();

				$obj->grp_id_group = $group->id;
				$obj->grp_controller = $perm[0];
				$obj->grp_method = $perm[1];

				$obj->save();
			}
		}
	}

	public function getPermissions(Request $request) {
		return response()->json($this->getPermissionsList(), 200, [], JSON_UNESCAPED_UNICODE);
	}

	public function simpleList(Request $request) {
		return response()->json(Group::where(["gro_active" => 1])->get());
	}

	public function list(Request $request) {
		$columnsToFilter = ['gro_name'];

		$wheres = array(
			'gro_active' => 1
		);

		return response()->json(["data" => Utils::createDataTableResult($request, Group::class, $wheres, $columnsToFilter)]);
	}

	public function get(Request $request, $id) {
		return response()->json(Group::where(["gro_active" => 1, "id" => $id])->with('permissions')->firstOrFail());
	}

	public function store(Request $request) {
		$this->validate($request, [
			'gro_name' => 'required|unique:groups',
			'permissions' => 'required|array|min:1'
		]);

		$obj = new Group;

		$obj->gro_name = $request->gro_name;
		$obj->gro_active = 1;

		$obj->save();

		foreach ($request->permissions as $perm) {
			$gpa = new GroupPermission;

			$gpa->grp_id_group = $obj->id;
			$gpa->grp_controller = $perm[0];
			$gpa->grp_method = $perm[1];

			$gpa->save();
		}

		return response()->json($obj);
	}

	public function update(Request $request, $id) {
		$this->validate($request, [
			'gro_name' => 'required',
			'permissions' => 'required|array|min:1'
		]);

		$obj = Group::where(['gro_active' => 1, 'id' => $id])->with('permissions')->firstOrFail();

		$obj->gro_name = $request->gro_name;

		$obj->save();

		foreach ($obj->permissions as $perm) {
			$perm->delete();
		}

		foreach ($request->permissions as $perm) {
			$gpa = new GroupPermission;

			$gpa->grp_id_group = $obj->id;
			$gpa->grp_controller = $perm[0];
			$gpa->grp_method = $perm[1];

			$gpa->save();
		}

		return response()->json($obj);
	}

	public function destroy(Request $request, $id) {
		$obj = Group::where(['gro_active' => 1, 'id' => $id])->firstOrFail();

		$obj->gro_active = 0;
		$obj->save();

		return response(null, 200);
	}
}
