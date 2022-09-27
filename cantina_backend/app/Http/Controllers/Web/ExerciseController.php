<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Exercise;
use App\Models\ExerciseSet;
use App\Models\Share;
use App\Models\TherapistPatient;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ExerciseController extends Controller {

	public function store(Request $request) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'exe_pressure' => 'required|numeric',
			'exe_name_device'	=>	'required|max:255',
			'exe_limb'	=>	'required|max:255',
			'exe_mode'	=>	'required|max:255',
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors], 422);
		}

		$obj = new Exercise;

		$obj->exe_pressure = $request->exe_pressure;
		$obj->exe_limb = $request->exe_limb;
		$obj->exe_mode = $request->exe_mode;
		$obj->exe_name_device = $request->exe_name_device;
		$obj->exe_id_user = $request->exe_id_user;

		if ($request->exe_mode == 'Intermittent') {
			if ($request->exe_sets && count($request->exe_sets) > 0) {
				$somaTempo = 0;

				foreach ($request->exe_sets as $exerciseSetDuration) {
					$somaTempo = $somaTempo + $exerciseSetDuration;
				}

				$obj->exe_calories = $this->calculaCalorias($somaTempo);
			}
		}

		$obj->save();

		if ($request->exe_mode == 'Intermittent') {
			if ($request->exe_sets && count($request->exe_sets) > 0) {
				foreach ($request->exe_sets as $exerciseSetDuration) {
					$set = new ExerciseSet();

					$set->ext_id_exercises = $obj->id;
					$set->ext_duration = $exerciseSetDuration;

					$set->save();
				}
			} else {
				return response()->json(['errors' => ['The exercise must have at least one set']], 422);
			}
		}

		return response()->json($obj);
	}

	public function update(Request $request, $id) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'exe_pressure' => 'required|numeric',
			'exe_name_device'	=>	'required|max:255',
			'exe_limb'	=>	'required|max:255',
			'exe_mode'	=>	'required|max:255',
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors], 422);
		}

		$obj = Exercise::where(['id' => $id])->firstOrFail();

		$obj->exe_pressure = $request->exe_pressure;
		$obj->exe_limb = $request->exe_limb;
		$obj->exe_mode = $request->exe_mode;
		$obj->exe_name_device = $request->exe_name_device;

		if ($request->exe_duration) {
			$obj->exe_calories = $this->calculaCalorias($request->exe_duration);
		}

		$obj->save();

		if ($request->exe_duration) {
			$set = new ExerciseSet();

			$set->ext_id_exercises = $obj->id;
			$set->ext_duration = $request->exe_duration;

			$set->save();
		}

		return response()->json($obj);
	}

	private function calculaCalorias($tempoExercicio = 0) {
		//MIT EXER AEROBICO = 6.5
		//PESO MEDIO = 65KG
		return (6.5 * 65 * floor($tempoExercicio / 60));
	}

	public function simpleList(Request $request) {
		$patients = TherapistPatient::where(['thp_id_therapist' =>  $request->user()->id])->get();

		$arrayIds = [];

		foreach ($patients as $patient) {
			array_push($arrayIds, $patient->thp_id_patient);
		}

		if ($request->user()->usr_type == 'therapist' && !empty($request->filter)) {
			$exercises = Exercise::where('exe_id_user', $request->filter['id'])->orderBy('created_at', 'desc');
		} else if ($request->user()->usr_type == 'therapist') {
			$exercises = Exercise::whereIn('exe_id_user', $arrayIds)->orderBy('created_at', 'desc');
		} else {
			$exercises = Exercise::where('exe_id_user', $request->user()->id)->orderBy('created_at', 'desc');
		}

		$currentPage = $request->page + 1;

		Paginator::currentPageResolver(function () use ($currentPage) {
			return $currentPage;
		});

		$exercises = $exercises->paginate($request->rows);

		return response()->json($exercises);
	}

	public function get(Request $request, $id) {
		return response()->json(Exercise::with(['sets'])->with('user.photo')->where(["id" => $id])->firstOrFail());
	}

	public function share(Request $request, $id) {
		$exercise = Exercise::where(['exe_id_user' => $request->user()->id, 'id' => $id])->firstOrFail();

		$exercise_shares = [];

		foreach ($request->sharedWith as $user) {
			array_push($exercise_shares, Share::create([
				'exs_id_users' => $user,
				'exs_id_exercises' => $exercise->id
			]));
		}

		return response()->json($exercise_shares);
	}

	public function delete(Request $request, $id) {
		$exercise = Exercise::where(['id' => $id])->with('sets')->firstOrFail();

		if ($exercise->sets) {
			foreach ($exercise->sets as $set) {
				$set = ExerciseSet::where(['id' => $set->id])->firstOrFail();

				$set->delete();
			}
		}

		$exercise->delete();

		return response(null, 200);
	}
}
