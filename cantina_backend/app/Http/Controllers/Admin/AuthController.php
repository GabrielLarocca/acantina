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
			'email' => 'required|email',
			'password' => 'required'
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors]);
		}

		$user = Admin::where('email', $request->email)->where('adm_active', 1)->first();

		if (!$user || !Hash::check($request->password, $user->password)) {
			return response()->json(['errors' => ['The provided credentials are incorrect.']], 401);
		}

		$token = $user->createToken('user', ['api:admin'])->plainTextToken;

		return response()->json(['user' => $user, 'token' => $token]);
	}

	public function forgotPassword(Request $request) {
		$this->validate($request, [
			'email' => 'required|email',
		]);

		$status = Password::broker('admins')->sendResetLink($request->only('email'));

		return response($status === Password::RESET_LINK_SENT ? (['status' => __($status)]) : (['email' => __($status)]));
	}

	public function resetPassword(Request $request) {
		$this->validate($request, [
			'token' => 'required',
			'password' => 'required|min:6|confirmed',
		]);

		Password::broker('admins')->reset($request->only('email', 'password', 'password_confirmation', 'token'), function ($user, $password) {
			$user->password = bcrypt($password);

			$user->save();

			event(new PasswordReset($user));
		});
	}
}
