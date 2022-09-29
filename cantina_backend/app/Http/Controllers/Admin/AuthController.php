<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller {

	public function auth(Request $request) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'adm_email' => 'required|email',
			'adm_password' => 'required'
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors]);
		}

		$user = Admin::where('adm_email', $request->adm_email)->first();

		if (!$user || !Hash::check($request->adm_password, $user->adm_password)) {
			return response()->json(['errors' => ['As credencias informadas estão incorretas.']], 401);
		}

		$token = $user->createToken('user', ['api:admin'])->plainTextToken;

		return response()->json(['user' => $user, 'token' => $token]);
	}

	public function register(Request $request) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'adm_name' => 'required',
			'adm_email' => 'required|email',
			'adm_password' => 'required',
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors]);
		}

		$obj = new Admin;

		$obj->adm_name = $request->adm_name;
		$obj->adm_email = $request->adm_email;
		$obj->adm_password = bcrypt($request->adm_password);

		$obj->save();

		return response()->json(['user' => $obj]);
	}
}
