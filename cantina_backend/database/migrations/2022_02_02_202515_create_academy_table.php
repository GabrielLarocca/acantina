<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAcademyTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('academy', function (Blueprint $table) {
			$table->id();
			$table->string('aca_title');
			$table->string('aca_level');
			$table->integer('aca_duration');
			$table->text('aca_text');
			$table->unsignedBigInteger('aca_id_video');
			$table->unsignedBigInteger('aca_id_photo');
			$table->boolean('aca_active')->default('1');
			$table->timestamps();

			$table->foreign('aca_id_video')->references('id')->on('files');
			$table->foreign('aca_id_photo')->references('id')->on('files');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('academy');
	}
}
