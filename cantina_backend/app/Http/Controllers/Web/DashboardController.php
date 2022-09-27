<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\Usuario;
use Illuminate\Http\Request;

class DashboardController extends Controller {

	public function getDashboard(Request $request) {
		$user = User::where('id', $request->user()->id)->first();

		$data = (object) [];

		if ($user->usr_type == 'therapist') {
			$therapistPatients = TherapistPatient::with('patient.photo')->where(['thp_id_therapist' => $request->user()->id])->orderBy('created_at', 'desc')->take(5)->get();
			$data->therapistPatients = $therapistPatients;
		}

		$patients = TherapistPatient::where(['thp_id_therapist' =>  $request->user()->id])->get();

		$arrayIds = [];

		foreach ($patients as $patient) {
			array_push($arrayIds, $patient->thp_id_patient);
		}

		if ($request->user()->usr_type == 'therapist') {
			$exercises = Exercise::whereIn('exe_id_user', $arrayIds)->with('user.photo')->orderBy('created_at', 'desc')->take(5)->get();
		} else {
			$exercises = Exercise::where('exe_id_user', $request->user()->id)->with('user.photo')->orderBy('created_at', 'desc')->take(5)->get();
		}

		$data->exercises = $exercises;

		return response()->json($data);
	}
}
