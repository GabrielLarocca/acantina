<?php

namespace Database\Seeders;

use App\Models\Exercise;
use Illuminate\Database\Seeder;


class ExerciseSeeder extends Seeder {

	public function run() {
		// $exercise = Exercise::create([
		// 	'exe_id_user' => 7,
		// 	'exe_id_device' => 2,
		// 	'exe_pressure' => 87,
		// 	'exe_calories' => 100,
		// 	'exe_limb' => 'Ombro',
		// 	'exe_mode' => 'manual'
		// ]);

		// $exercise = Exercise::create([
		// 	'exe_id_user' => 7,
		// 	'exe_id_device' => 2,
		// 	'exe_pressure' => 87,
		// 	'exe_calories' => 87,
		// 	'exe_limb' => 'Deltoide',
		// 	'exe_mode' => 'manual'
		// ]);


		// $exercise = Exercise::create([
		// 	'exe_id_user' => 7,
		// 	'exe_id_device' => 2,
		// 	'exe_pressure' => 87,
		// 	'exe_calories' => 87,
		// 	'exe_limb' => 'Antebraço',
		// 	'exe_mode' => 'manual'
		// ]);


		// $exercise = Exercise::create([
		// 	'exe_id_user' => 7,
		// 	'exe_id_device' => 2,
		// 	'exe_pressure' => 87,
		// 	'exe_calories' => 87,
		// 	'exe_limb' => 'Posterior',
		// 	'exe_mode' => 'manual'
		// ]);


		// $exercise = Exercise::create([
		// 	'exe_id_user' => 7,
		// 	'exe_id_device' => 2,
		// 	'exe_pressure' => 87,
		// 	'exe_calories' => 87,
		// 	'exe_limb' => 'Gluteo',
		// 	'exe_mode' => 'manual'
		// ]);

		// $exercise = Exercise::create([
		// 	'exe_id_user' => 7,
		// 	'exe_id_device' => 2,
		// 	'exe_pressure' => 87,
		// 	'exe_calories' => 87,
		// 	'exe_limb' => 'Panturrilha',
		// 	'exe_mode' => 'manual'
		// ]);
		

		// $exercise = Exercise::create([
		// 	'exe_id_user' => 7,
		// 	'exe_id_device' => 2,
		// 	'exe_pressure' => 87,
		// 	'exe_calories' => 87,
		// 	'exe_limb' => 'Quadriceps',
		// 	'exe_mode' => 'manual'
		// ]);


		// $exercise = Exercise::create([
		// 	'exe_id_user' => 7,
		// 	'exe_id_device' => 2,
		// 	'exe_pressure' => 87,
		// 	'exe_calories' => 87,
		// 	'exe_limb' => 'Peito',
		// 	'exe_mode' => 'manual'
		// ]);


		// $exercise = Exercise::create([
		// 	'exe_id_user' => 7,
		// 	'exe_id_device' => 2,
		// 	'exe_pressure' => 87,
		// 	'exe_calories' => 87,
		// 	'exe_limb' => 'Abdome',
		// 	'exe_mode' => 'manual'
		// ]);

		$exercise = Exercise::create([
			'exe_id_user' => 1,
			'exe_id_device' => 7,
			'exe_pressure' => 87,
			'exe_calories' => 87,
			'exe_limb' => 'Quadriceps',
			'exe_mode' => 'manual'
		]);


		$exercise = Exercise::create([
			'exe_id_user' => 1,
			'exe_id_device' => 7,
			'exe_pressure' => 87,
			'exe_calories' => 87,
			'exe_limb' => 'Peito',
			'exe_mode' => 'manual'
		]);


		$exercise = Exercise::create([
			'exe_id_user' => 1,
			'exe_id_device' => 7,
			'exe_pressure' => 87,
			'exe_calories' => 87,
			'exe_limb' => 'Abdome',
			'exe_mode' => 'manual'
		]);

		$exercise = Exercise::create([
			'exe_id_user' => 1,
			'exe_id_device' => 7,
			'exe_pressure' => 87,
			'exe_calories' => 87,
			'exe_limb' => 'Costa',
			'exe_mode' => 'manual'
		]);
		
		Exercise::create([
			'exe_id_user' => 1,
			'exe_id_device' => 7,
			'exe_pressure' => 87,
			'exe_calories' => 87,
			'exe_limb' => 'Costa',
			'exe_mode' => 'manual'
		]);
		
		Exercise::create([
			'exe_id_user' => 1,
			'exe_id_device' => 7,
			'exe_pressure' => 87,
			'exe_calories' => 87,
			'exe_limb' => 'Adomen',
			'exe_mode' => 'manual'
		]);

		Exercise::create([
			'exe_id_user' => 1,
			'exe_id_device' => 7,
			'exe_pressure' => 87,
			'exe_calories' => 87,
			'exe_limb' => 'Posterior',
			'exe_mode' => 'manual'
		]);

		Exercise::create([
			'exe_id_user' => 1,
			'exe_id_device' => 7,
			'exe_pressure' => 87,
			'exe_calories' => 87,
			'exe_limb' => 'Posterior',
			'exe_mode' => 'manual'
		]);

		Exercise::create([
			'exe_id_user' => 1,
			'exe_id_device' => 7,
			'exe_pressure' => 87,
			'exe_calories' => 87,
			'exe_limb' => 'Antebraço',
			'exe_mode' => 'manual'
		]);

		Exercise::create([
			'exe_id_user' => 1,
			'exe_id_device' => 7,
			'exe_pressure' => 87,
			'exe_calories' => 87,
			'exe_limb' => 'Perna',
			'exe_mode' => 'manual'
		]);
	}

}