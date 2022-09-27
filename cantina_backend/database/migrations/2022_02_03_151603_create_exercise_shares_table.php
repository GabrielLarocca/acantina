<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExerciseSharesTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('exercise_shares', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('exs_id_exercises');
			$table->unsignedBigInteger('exs_id_users');
			$table->timestamps();

			$table->foreign('exs_id_exercises')->references('id')->on('exercises');
			$table->foreign('exs_id_users')->references('id')->on('users');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('exercise_shares');
	}
}
