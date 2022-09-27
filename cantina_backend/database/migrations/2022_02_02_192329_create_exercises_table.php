<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExercisesTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('exercises', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('exe_id_user');
			$table->string('exe_name_device');
			$table->integer('exe_pressure');
			$table->integer('exe_calories')->nullable();
			$table->string('exe_limb');
			$table->string('exe_mode');
			$table->timestamps();

			$table->foreign('exe_id_user')->references('id')->on('users');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('exercises');
	}
}
