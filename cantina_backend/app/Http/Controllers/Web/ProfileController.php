<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Helpers\Utils;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller {

	public function update(Request $request) {
		$errors = array();

		$usr = User::with('photo')->where('id', $request->user()->id)->firstOrFail();

		$validator = Validator::make($request->all(), [
			'usr_name' => 'required',
			'email' => 'required|email|unique:users,email,' . $request->user()->id,
			'usr_phone' => 'required'
		]);

		if ($request->password) {
			if (!$request->oldPassword || !Hash::check($request->oldPassword, $usr->password)) {
				return response()->json(['error' => ['The current password does not match our records.']]);
			} else if (strlen($request->password) < 8) {
				return response()->json(['error' => ['The password field must contain at least 8 characters.']]);
			}
		}

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors], 422);
		}

		if ($request->file('usr_photo') != null) {
			$validator = Validator::make($request->all(), [
				'usr_photo' => 'required|mimes:jpeg,jpg,png|max:10240',
			]);

			if ($validator->fails()) {
				foreach ($validator->errors()->getMessages() as $item) {
					array_push($errors, $item[0]);
				}

				return response()->json(['errors' => $errors], 422);
			}

			$attachment = Utils::addAttachment($request->file('usr_photo'));

			$usr->usr_id_photo = $attachment->id;
		}

		$usr->usr_name = $request->usr_name;
		$usr->email = $request->email;
		$request->password ? $usr->password = bcrypt($request->password) : null;
		$usr->usr_phone = $request->usr_phone;

		$usr->save();

		return response()->json($usr);
	}
}
