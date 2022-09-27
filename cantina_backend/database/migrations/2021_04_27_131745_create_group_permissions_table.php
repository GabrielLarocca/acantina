<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupPermissionsTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('group_permissions', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('grp_id_group');
			$table->string('grp_controller');
			$table->string('grp_method');
			$table->timestamps();

			$table->foreign('grp_id_group')->references('id')->on('groups');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::dropIfExists('group_permissions');
	}
}
