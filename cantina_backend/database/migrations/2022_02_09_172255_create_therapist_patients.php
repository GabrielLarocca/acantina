<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTherapistPatients extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('therapist_patients', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('thp_id_therapist');
			$table->unsignedBigInteger('thp_id_patient');
			$table->timestamps();

			$table->foreign('thp_id_therapist')->references('id')->on('users');
			$table->foreign('thp_id_patient')->references('id')->on('users');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('therapist_patients');
	}
}
