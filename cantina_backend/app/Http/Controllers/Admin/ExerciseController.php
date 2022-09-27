<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Exercise;
use App\Models\ExerciseActivity;
use App\Helpers\Utils;

class ExerciseController extends Controller {
	public function simpleList(Request $request) {
		return response()->json(Exercise::where(["exe_active" => 1])->get());
	}

	public function list(Request $request) {
		$columnsToFilter = ['exe_pressure', 'exe_calories', 'exe_limb', 'exe_mode'];

		$wheres = array(
			'exe_id_user' => $request->user()->id
		);

		return response()->json(["data" => Utils::createDataTableResult($request, Exercise::class, $wheres, $columnsToFilter)]);
	}

	public function get(Request $request, $id) {
		return response()->json(Exercise::where(["exe_active" => 1, "id" => $id])->with('image', 'activities.video')->firstOrFail());
	}

	public function store(Request $request) {
		$this->validate($request, [
			'exe_name' => 'required',
			'exe_duration_time_minutes' => 'required',
			'exe_type' => 'required',
			'exe_instructions' => 'required',
			'exe_equipament' => 'required',
			'thumbnail' => 'required|image|mimes:jpeg,png,jpg|max:1024',
			'activities' => 'required|array|min:1'
		]);

		$obj = new Exercise;

		$obj->exe_name = $request->exe_name;
		$obj->exe_duration_time_minutes = $request->exe_duration_time_minutes;
		$obj->exe_type = $request->exe_type;
		$obj->exe_instructions = $request->exe_instructions;
		$obj->exe_equipament = $request->exe_equipament;
		$obj->exe_faq = $request->exe_faq;
		$obj->exe_active = 1;

		$file = Utils::addAttachment($request->thumbnail);

		$obj->exe_id_image = $file->id;

		$obj->save();

		foreach ($request->activities as $act) {
			$eac = new ExerciseActivity;

			$eac->exa_id_exercise = $obj->id;
			$eac->exa_name = $act["exa_name"];
			$eac->exa_difficulty_level = $act["exa_difficulty_level"];
			$eac->exa_id_video = $act["exa_id_video"];

			$eac->save();
		}

		return response()->json($obj);
	}

	public function update(Request $request, $id) {
		$this->validate($request, [
			'exe_name' => 'required',
			'exe_duration_time_minutes' => 'required',
			'exe_type' => 'required',
			'exe_instructions' => 'required',
			'exe_equipament' => 'required',
			'activities' => 'required|array|min:1'
		]);

		$obj = Exercise::where(['exe_active' => 1, 'id' => $id])->firstOrFail();

		$obj->exe_name = $request->exe_name;
		$obj->exe_duration_time_minutes = $request->exe_duration_time_minutes;
		$obj->exe_type = $request->exe_type;
		$obj->exe_instructions = $request->exe_instructions;
		$obj->exe_equipament = $request->exe_equipament;
		$obj->exe_faq = $request->exe_faq;

		if ($request->thumbnail != null) {
			$this->validate($request, [
				'thumbnail' => 'image|mimes:jpeg,png,jpg|max:1024',
			]);

			$file = Utils::addAttachment($request->thumbnail);

			$obj->exe_id_image = $file->id;
		}

		$obj->save();

		// Remove missing activities
		$toRemove = $obj->activities->filter(function ($value, $key) use ($request) {
			foreach ($request->activities as $rac) {
				if (array_key_exists("id", $rac)) {
					if ($rac["id"] == $value->id) {
						return false;
					}
				}
			}

			return true;
		});

		if (!empty($toRemove)) {
			foreach ($toRemove as $rem) {
				$rem->delete();
			}
		}

		foreach ($request->activities as $act) {
			$eac = new ExerciseActivity;

			// Getting existing activity to update
			if (array_key_exists("id", $act)) {
				$eac = ExerciseActivity::where(['exa_id_exercise' => $obj->id, 'id' => $act["id"]])->firstOrFail();
			}

			$eac->exa_id_exercise = $obj->id;
			$eac->exa_name = $act["exa_name"];
			$eac->exa_difficulty_level = $act["exa_difficulty_level"];
			$eac->exa_id_video = $act["exa_id_video"];

			$eac->save();
		}

		return response()->json($obj);
	}

	public function destroy(Request $request, $id) {
		$obj = Exercise::where(['exe_active' => 1, 'id' => $id])->firstOrFail();

		$obj->exe_active = 0;
		$obj->save();

		return response(null, 200);
	}

	public function uploadVideo(Request $request) {
		$this->validate($request, [
			'video' => 'required|mimes:mp4,mov,ogg,qt|max:100000',
		]);

		$file = Utils::addAttachment($request->file('video'));

		return response()->json(['id_video' => $file->id]);
	}
}
