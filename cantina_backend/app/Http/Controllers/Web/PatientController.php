<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Exercise;

use Illuminate\Support\Facades\Validator;
use App\Helpers\Utils;
use App\Models\TherapistPatient;
use App\Models\User;
use Faker\Generator;
use Illuminate\Container\Container;
use Illuminate\Pagination\Paginator;

class PatientController extends Controller {

	public function store(Request $request) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'usr_name' => 'required',
			'email' => 'required|email',
			'usr_phone' => 'required'
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors], 422);
		}

		User::where(['id' => $request->user()->id, 'usr_type' => 'therapist'])->firstOrFail();

		$usr_id_photo = null;

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

			$usr_id_photo = $attachment->id;
		}

		$usr = User::where(['email' => $request->email])->first();

		if (!isset($usr)) {
			$usr = new User();

			$faker = Container::getInstance()->make(Generator::class);

			$usr->email = $request->email;
			$usr->usr_name = $request->usr_name;
			$usr->usr_phone = $request->usr_phone;
			$usr->usr_id_photo = $usr_id_photo;
			$usr->password = bcrypt($faker->password(6, 20));
			$usr->usr_type = 'user';

			$usr->save();
		}

		$patient = TherapistPatient::where(['thp_id_therapist' => $request->user()->id, 'thp_id_patient' => $usr->id])->first();

		if (!isset($patient)) {
			$patient = new TherapistPatient();

			$patient->thp_id_therapist = $request->user()->id;
			$patient->thp_id_patient = $usr->id;

			$patient->save();
		}

		return response()->json($patient);
	}

	public function simpleList(Request $request) {
		$patients = TherapistPatient::where('thp_id_therapist', $request->user()->id);
		$patientsAsUsers = User::whereIn('id', $patients->pluck('thp_id_patient'))->with('photo');

		if (!empty($request->filter)) {
			$patientsAsUsers->where('usr_name', 'LIKE', '%' . $request->filter . '%');
		}

		$currentPage = $request->page + 1;

		Paginator::currentPageResolver(function () use ($currentPage) {
			return $currentPage;
		});

		$patientsAsUsers = $patientsAsUsers->paginate($request->rows);

		return response()->json($patientsAsUsers);
	}

	public function get(Request $request, $id) {
		$patient = TherapistPatient::with(['patient.photo', 'patient.exercises'])->where(['thp_id_therapist' => $request->user()->id, 'thp_id_patient' => $id])->firstOrFail();

		return response()->json($patient);
	}

	public function update(Request $request, $id) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'usr_name' => 'required',
			'email' => 'required|email|unique:users,email,' . $id,
			'usr_phone' => 'required|numeric'
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors], 422);
		}

		$patient = TherapistPatient::with('patient')->where(['thp_id_therapist' => $request->user()->id, 'thp_id_patient' => $id])->firstOrFail();
		$usr = User::where('id', $patient->patient->id)->firstOrFail();

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
		$usr->usr_phone = $request->usr_phone;

		$usr->save();

		return response()->json($usr);
	}

	public function delete(Request $request, $id) {
		$patient = TherapistPatient::where(['thp_id_therapist' => $request->user()->id, 'thp_id_patient' => $id])->firstOrFail();

		$patient->delete();

		return response(null, 200);
	}

	public function listExercise(Request $request) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'thp_id_patient' => 'required',
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors], 422);
		}

		$patient = TherapistPatient::with('patient')->where(['thp_id_therapist' => $request->user()->id, 'thp_id_patient' => $request->thp_id_patient])->firstOrFail();
		$exercises = Exercise::where('exe_id_user', $patient->patient->id)->with('sets')->orderBy('created_at', 'desc');

		$currentPage = $request->page + 1;

		Paginator::currentPageResolver(function () use ($currentPage) {
			return $currentPage;
		});

		$exercises = $exercises->paginate($request->rows);

		return response()->json($exercises);
	}
}
