<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use App\Helpers\Utils;
use App\Models\Academy;
use Illuminate\Support\Facades\Log;

class AcademyController extends Controller {
	public function list(Request $request) {
		$columnsToFilter = ['aca_title', 'aca_level', 'aca_duration', 'aca_text'];

		$wheres = array(
			'aca_active' => 1
		);

		return response()->json(["data" => Utils::createDataTableResult($request, Academy::class, $wheres, $columnsToFilter)]);
	}

	public function get(Request $request, $id) {
		return response()->json(Academy::where(["aca_active" => 1, "id" => $id])->with('video', 'photo')->firstOrFail());
	}

	public function store(Request $request) {
		$this->validate($request, [
			'aca_title' => 'required',
			'aca_level' => 'required',
			'aca_duration' => 'required',
			'aca_text' => 'required',
			'video' => 'required|mimes:mp4,mov,ogg,qt|max:1000000',
			'photo' => 'required|image|mimes:jpeg,png,jpg|max:1024',
		]);

		$obj = new Academy();

		$obj->aca_title = $request->aca_title;
		$obj->aca_level = $request->aca_level;
		$obj->aca_duration = $request->aca_duration;
		$obj->aca_text = $request->aca_text;
		$obj->aca_active = 1;

		if ($request->file('video') != null) {
			$attachment = Utils::addAttachment($request->file('video'));

			$obj->aca_id_video = $attachment->id;
		}

		if ($request->file('photo') != null) {
			$attachment = Utils::addAttachment($request->file('photo'));

			$obj->aca_id_photo = $attachment->id;
		}

		$obj->save();

		return response()->json($obj);
	}

	public function update(Request $request, $id) {
		$this->validate($request, [
			'aca_title' => 'required',
			'aca_level' => 'required',
			'aca_duration' => 'required',
			'aca_text' => 'required',
		]);

		$obj = Academy::where(['aca_active' => 1, 'id' => $id])->firstOrFail();

		$obj->aca_title = $request->aca_title;
		$obj->aca_level = $request->aca_level;
		$obj->aca_duration = $request->aca_duration;
		$obj->aca_text = $request->aca_text;

		if ($request->file('video') != null) {
			$this->validate($request, [
				'video' => 'required|mimes:mp4,mov,ogg,qt|max:1000000',
			]);

			$attachment = Utils::addAttachment($request->file('video'));

			$obj->aca_id_video = $attachment->id;
		}

		if ($request->file('photo') != null) {
			$this->validate($request, [
				'photo' => 'required|image|mimes:jpeg,png,jpg|max:1024',
			]);

			$attachment = Utils::addAttachment($request->file('photo'));

			$obj->aca_id_photo = $attachment->id;
		}

		$obj->save();

		return response()->json($obj);
	}

	public function destroy(Request $request, $id) {
		$obj = Academy::where(['aca_active' => 1, 'id' => $id])->firstOrFail();

		$obj->aca_active = 0;
		$obj->save();

		return response(null, 200);
	}
}
