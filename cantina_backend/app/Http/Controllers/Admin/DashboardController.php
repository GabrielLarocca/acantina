<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Academy;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Exercise;


class DashboardController extends Controller {
	// TODO VAI TER DASHBOARD?
	// public function get(Request $request) {
	// 	$total_users = User::where(['usr_active' => 1])->count();
	// 	$total_exercises = Exercise::count();
	// 	$total_workouts = Academy::count();

	// 	return response()->json([
	// 		'total_users' => $total_users,
	// 		'total_exercises' => $total_exercises,
	// 		'total_workouts' => $total_workouts
	// 	]);
	// }
}
