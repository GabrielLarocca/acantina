<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('users', function (Blueprint $table) {
			$table->id();
			$table->string('usr_name');
			$table->string('email')->unique();
			$table->string('usr_phone');
			$table->string('password');
			$table->unsignedBigInteger('usr_id_photo')->nullable();
			$table->string('usr_type');
			$table->string('usr_push_token')->nullable();
			$table->boolean('usr_first_use')->default('1');
			$table->boolean('usr_active')->default('1');
			$table->rememberToken();
			$table->timestamps();

			$table->foreign('usr_id_photo')->references('id')->on('files');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('users');
	}
}
