<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Carrinho;
use Illuminate\Http\Request;
use App\Models\Usuario;
use App\Notifications\PasswordResetNotificationApp;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Notification;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

use Illuminate\Support\Facades\Log;

class AuthController extends Controller {

	function resetPassword(Request $request) {
		$validator = Validator::make($request->all(), [
			'token' => 'required',
			'usu_email' => 'required|email',
			'usu_senha' => 'required|min:6',
		]);

		$errors = array();

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors]);
		}

		$tokenData = DB::table('password_resets')->where('token', $request->token)->first();

		$user = Usuario::where('email', $tokenData->email)->first();
		if (!$user) return response()->json(['errors' => 'Usuario não existe.']);

		$user->usu_senha = Hash::make($request->usu_senha);
		$user->save();

		DB::table('password_resets')->where('email', $user->email)->delete();

		return response()->json(['user' => $user]);
	}

	function url_get_contents($url) {
		if (!function_exists('curl_init')) {
			die('CURL is not installed!');
		}

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$output = curl_exec($ch);
		curl_close($ch);

		Log::info($output);
		return $output;
	}

	private function authenticateUser($user) {
		$token = $user->createToken('usuario', ['api:web'])->plainTextToken;

		return response()->json(['user' => $user, 'token' => $token]);
	}

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

		$user = Usuario::where(['email' => $request->email, 'usr_active' => 1])->first();

		if (!$user || !Hash::check($request->password, $user->password)) {
			return response()->json(['errors' => ['As credencias estão erradas.']], 401);
		}

		return $this->authenticateUser($user);
	}

	public function register(Request $request) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'usr_name' => 'required',
			'email' => 'required|email',
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

		return $this->authenticateUser($obj);
	}

	public function edit(Request $request) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'usr_name' => 'required',
			'email' => 'required|email',
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors]);
		}

		$obj = Usuario::where(["id" => $request->user()->id])->firstOrFail();

		$obj->usr_name = $request->usr_name;
		$obj->email = $request->email;

		if ($request->password) {
			$obj->password = bcrypt($request->password);
		}

		$obj->usr_active = 1;

		$obj->save();


		return $obj;
	}

	public function get(Request $request) {
		return response()->json(Usuario::where(["id" => $request->user()->id])->firstOrFail());
	}
}
