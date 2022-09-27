<?php

namespace Database\Seeders;

use App\Models\Exercise;
use App\Models\Share;
use Illuminate\Database\Seeder;


class ExerciseShareSeeder extends Seeder {

	public function run() {
		Share::create([
			'exs_id_exercises' => 5,
			'exs_id_users' => 7
		]);

		Share::create([
			'exs_id_exercises' => 5,
			'exs_id_users' => 8
		]);


		Share::create([
			'exs_id_exercises' => 5,
			'exs_id_users' => 9
		]);


		Share::create([
			'exs_id_exercises' => 6,
			'exs_id_users' => 6
		]);


		Share::create([
			'exs_id_exercises' => 6,
			'exs_id_users' => 7
		]);

		Share::create([
			'exs_id_exercises' => 6,
			'exs_id_users' => 8
		]);
		

		Share::create([
			'exs_id_exercises' => 7,
			'exs_id_users' => 9
		]);


		Share::create([
			'exs_id_exercises' => 5,
			'exs_id_users' => 10
		]);
	}

}