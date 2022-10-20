<?php

namespace Database\Seeders;

use App\Models\Admin;
use Database\Factories\UserFactory;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder {
	/**
	 * Seed the application's database.
	 *
	 * @return void
	 */
	public function run() {

		$admin = Admin::create([
			'adm_name' => 'admin',
			'adm_email' => 'admin@admin.com',
			'adm_password' => bcrypt('123456'),
		]);

		$admin->save();
	}
}
