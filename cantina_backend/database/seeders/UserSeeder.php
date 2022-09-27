<?php

namespace Database\Seeders;

use App\Models\User;

class UserSeeder extends Seeder {
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run() {
		$patients = User::create([
			'thp_id_therapist' => 2,
			'thp_id_patient' => 3
		]);

		$patients->save();
	}
}
