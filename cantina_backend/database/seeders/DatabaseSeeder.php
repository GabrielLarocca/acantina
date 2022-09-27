<?php

namespace Database\Seeders;

use App\Models\Exercise;
use App\Models\User;
use Database\Factories\UserFactory;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder {
	/**
	 * Seed the application's database.
	 *
	 * @return void
	 */
	public function run() {

		User::factory(100)->create();

		$this->call([
			// TherapistPatientSeeder::class,
			//ExerciseSeeder::class,
			//ExerciseShareSeeder::class
		]);
	}
}
