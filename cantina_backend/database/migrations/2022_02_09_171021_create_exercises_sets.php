<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExercisesSets extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('exercises_sets', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('ext_id_exercises');
			$table->integer('ext_duration');
			$table->timestamps();

			$table->foreign('ext_id_exercises')->references('id')->on('exercises');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('exercises_sets');
	}
}
