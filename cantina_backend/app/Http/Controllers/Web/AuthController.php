<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
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
			'usu_email' => 'required|email',
			'usu_senha' => 'required',
			'usu_nome' => 'required'
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors]);
		}

		$user = Usuario::where(['usu_email' => $request->usu_email, 'usu_ativo' => 1])->with('photo')->first();

		if (!$user || !Hash::check($request->password, $user->password)) {
			return response()->json(['errors' => ['As credencias estão erradas.']], 401);
		}

		return $this->authenticateUser($user);
	}

	public function register(Request $request) {
		$this->validate($request, [
			'usu_nome' => 'required',
			'usu_email' => 'required',
			'usu_senha' => 'required',
		]);

		$obj = new Usuario;

		$obj->usu_nome = $request->usu_nome;
		$obj->usu_email = $request->usu_email;
		$obj->usu_senha = bcrypt($request->usu_senha);
		$obj->usu_ativo = 1;

		$obj->save();

		return $this->authenticateUser($obj, $firstLogin = true);
	}
}
