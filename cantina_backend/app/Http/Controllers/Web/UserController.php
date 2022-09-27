<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;


class UserController extends Controller {

	public function simpleList(Request $request) {
		if (!$request->page)
			return response()->json(['error' => ['The page field is required.']], 422);

		$users = User::with('photo');

		if ($request->filter) {
			$users->where('usr_name', 'LIKE', '%' . $request->filter . '%');
		}

		$users = $users->select('id', 'usr_name', 'email', 'usr_id_photo')->orderBy('usr_name', 'asc')->take(5)->get();

		return response()->json($users);
	}
}
