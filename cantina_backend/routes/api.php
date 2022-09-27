<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\UserController;
use App\Http\Controllers\Web\ExerciseController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\PatientController;
use App\Http\Controllers\Web\ProfileController;
use App\Http\Controllers\Web\AcademyController;

use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\GroupController as AdminGroupController;
use App\Http\Controllers\Admin\AdminController as AdminAdminController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\ExerciseController as AdminExerciseController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\AcademyController as AdminAcademyController;



/*
  |--------------------------------------------------------------------------
  | API Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register API routes for your application. These
  | routes are loaded by the RouteServiceProvider within a group which
  | is assigned the "api" middleware group. Enjoy building your API!
  |
 */

Route::group(['prefix' => 'web'], function () {
	Route::post('/auth', [AuthController::class, 'auth']);
	Route::post('/register', [AuthController::class, 'register']);

	Route::post('/forgot-password', [AuthController::class, 'sendEmail']);
	Route::post('/reset-password', [AuthController::class, 'resetPassword']);

	Route::group(['middleware' => ['auth:sanctum', 'user']], function () {
		Route::group(['prefix' => 'user'], function () {
			Route::get('/simpleList', [UserController::class, 'simpleList']);
		});

		Route::group(['prefix' => 'exercise'], function () {
			Route::post('/', [ExerciseController::class, 'store']);
			Route::post('/simpleList', [ExerciseController::class, 'simpleList']);
			Route::put('/{id}', [ExerciseController::class, 'update']);
			Route::post('/share/{id}', [ExerciseController::class, 'share']);
			Route::get('/{id}', [ExerciseController::class, 'get']);
			Route::delete('/{id}', [ExerciseController::class, 'delete']);
		});

		Route::group(['prefix' => 'patient'], function () {
			Route::post('/', [PatientController::class, 'store']);
			Route::post('/simpleList', [PatientController::class, 'simpleList']);
			Route::post('/listExercise', [PatientController::class, 'listExercise']);
			Route::delete('/{id}', [PatientController::class, 'delete']);
			Route::get('/{id}', [PatientController::class, 'get']);
			Route::post('/{id}', [PatientController::class, 'update']);
		});

		Route::group(['prefix' => 'academy'], function () {
			Route::post('/list', [AcademyController::class, 'list']);
			Route::get('/{id}', [AcademyController::class, 'get']);
		});

		Route::group(['prefix' => 'profile'], function () {
			Route::post('/', [ProfileController::class, 'update']);
		});

		Route::group(['prefix' => 'dashboard'], function () {
			Route::get('/', [DashboardController::class, 'getDashboard']);
		});
	});
});

Route::group(['prefix' => 'admin'], function () {
	Route::post('/auth', [AdminAuthController::class, 'auth']);
	Route::post('/forgot-password', [AdminAuthController::class, 'forgotPassword']);
	Route::post('/reset-password', [AdminAuthController::class, 'resetPassword']);

	Route::group(['middleware' => ['auth:sanctum']], function () {
		Route::post('/givePermissionsLocally', [AdminGroupController::class, 'givePermissionsLocally']);
	});

	Route::group(['middleware' => ['auth:sanctum', 'admin']], function () {
		Route::group(['prefix' => 'dashboard'], function () {
			Route::get('/', [AdminDashboardController::class, 'get']);
		});

		Route::group(['prefix' => 'group'], function () {
			Route::get('/permissions', [AdminGroupController::class, 'getPermissions']);
			Route::post('/list', [AdminGroupController::class, 'list']);
			Route::get('/simpleList', [AdminGroupController::class, 'simpleList']);
			Route::post('/', [AdminGroupController::class, 'store']);
			Route::get('/{id}', [AdminGroupController::class, 'get']);
			Route::put('/{id}', [AdminGroupController::class, 'update']);
			Route::delete('/{id}', [AdminGroupController::class, 'destroy']);
		});

		Route::group(['prefix' => 'admin'], function () {
			Route::post('/list', [AdminAdminController::class, 'list']);
			Route::post('/', [AdminAdminController::class, 'store']);
			Route::get('/{id}', [AdminAdminController::class, 'get']);
			Route::put('/{id}', [AdminAdminController::class, 'update']);
			Route::delete('/{id}', [AdminAdminController::class, 'destroy']);
		});

		Route::group(['prefix' => 'user'], function () {
			Route::post('/list', [AdminUserController::class, 'list']);
			Route::get('/{id}', [AdminUserController::class, 'get']);
			Route::delete('/{id}', [AdminUserController::class, 'destroy']);
		});

		Route::group(['prefix' => 'academy'], function () {
			Route::post('/', [AdminAcademyController::class, 'store']);
			Route::post('/list', [AdminAcademyController::class, 'list']);
			Route::get('/{id}', [AdminAcademyController::class, 'get']);
			Route::post('/{id}', [AdminAcademyController::class, 'update']);
			Route::delete('/{id}', [AdminAcademyController::class, 'destroy']);
		});

		Route::group(['prefix' => 'exercise'], function () {
			Route::post('/', [AdminExerciseController::class, 'list']);
			Route::post('/{id}', [AdminExerciseController::class, 'update']);
			Route::delete('/{id}', [AdminExerciseController::class, 'destroy']);
		});
	});
});
