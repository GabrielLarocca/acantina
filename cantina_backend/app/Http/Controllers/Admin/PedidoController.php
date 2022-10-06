<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Utils;
use App\Models\Carrinho;
use App\Models\Pedido;
use App\Models\Usuario;
use Illuminate\Support\Facades\Log;

class PedidoController extends Controller {
	public function simpleList(Request $request) {
		return response()->json(Pedido::where(["exe_active" => 1])->get());
	}

	public function list(Request $request) {
		$columnsToFilter = ['ord_cupom_id', 'ord_withdrawal_date', 'ord_cart_id', 'ord_total', 'ord_user_id', 'ord_state_payment', 'ord_state_order', 'ord_nf'];

		$with  = ['usuario', 'carrinho', 'cupom'];

		$wheres = array(
			'ord_user_id' => $request->user()->id
		);

		return response()->json(["data" => Utils::createDataTableResult($request, Pedido::class, $wheres, $columnsToFilter, null, null, null, $with)]);
	}

	public function get(Request $request, $id) {
		return response()->json(Pedido::where(["id" => $id])->with('usuario', 'carrinho', 'cupom')->firstOrFail());
	}

	public function store(Request $request) {
		$this->validate($request, [
			// 'ord_withdrawal_date' => 'required',
			// 'ord_cart_id' => 'required',
			// 'ord_user_id' => 'required',
			// 'ord_cupom_id' => 'required',
			// 'ord_state_payment' => 'required',
			// 'ord_state_order' => 'required',
		]);

		$obj = new Pedido;

		$q = Carrinho::where(["car_user_id" =>  $request->ord_user_id])->firstOrFail();

		Log::info($q);

		// $obj->ord_cupom_id = $request->ord_cupom_id;
		// $obj->ord_withdrawal_date = $request->ord_withdrawal_date;
		// $obj->ord_cart_id = $request->ord_cart_id;
		// $obj->ord_user_id = $request->ord_user_id;
		// $obj->ord_state_payment = $request->ord_state_payment;
		// $obj->ord_state_order = $request->ord_state_order;
		// $obj->ord_nf = $request->ord_nf;

		// $file = Utils::addAttachment($request->thumbnail);

		$obj->save();

		return response()->json($obj);
	}

	public function update(Request $request, $id) {
		$this->validate($request, [
			'exe_name' => 'required',
			'exe_duration_time_minutes' => 'required',
			'exe_type' => 'required',
			'exe_instructions' => 'required',
			'exe_equipament' => 'required',
			'activities' => 'required|array|min:1'
		]);

		$obj = Exercise::where(['exe_active' => 1, 'id' => $id])->firstOrFail();

		$obj->exe_name = $request->exe_name;
		$obj->exe_duration_time_minutes = $request->exe_duration_time_minutes;
		$obj->exe_type = $request->exe_type;
		$obj->exe_instructions = $request->exe_instructions;
		$obj->exe_equipament = $request->exe_equipament;
		$obj->exe_faq = $request->exe_faq;

		if ($request->thumbnail != null) {
			$this->validate($request, [
				'thumbnail' => 'image|mimes:jpeg,png,jpg|max:1024',
			]);

			$file = Utils::addAttachment($request->thumbnail);

			$obj->exe_id_image = $file->id;
		}

		$obj->save();

		// Remove missing activities
		$toRemove = $obj->activities->filter(function ($value, $key) use ($request) {
			foreach ($request->activities as $rac) {
				if (array_key_exists("id", $rac)) {
					if ($rac["id"] == $value->id) {
						return false;
					}
				}
			}

			return true;
		});

		if (!empty($toRemove)) {
			foreach ($toRemove as $rem) {
				$rem->delete();
			}
		}

		foreach ($request->activities as $act) {
			$eac = new ExerciseActivity;

			// Getting existing activity to update
			if (array_key_exists("id", $act)) {
				$eac = ExerciseActivity::where(['exa_id_exercise' => $obj->id, 'id' => $act["id"]])->firstOrFail();
			}

			$eac->exa_id_exercise = $obj->id;
			$eac->exa_name = $act["exa_name"];
			$eac->exa_difficulty_level = $act["exa_difficulty_level"];
			$eac->exa_id_video = $act["exa_id_video"];

			$eac->save();
		}

		return response()->json($obj);
	}

	public function destroy(Request $request, $id) {
		$obj = Exercise::where(['exe_active' => 1, 'id' => $id])->firstOrFail();

		$obj->exe_active = 0;
		$obj->save();

		return response(null, 200);
	}

	public function uploadVideo(Request $request) {
		$this->validate($request, [
			'video' => 'required|mimes:mp4,mov,ogg,qt|max:100000',
		]);

		$file = Utils::addAttachment($request->file('video'));

		return response()->json(['id_video' => $file->id]);
	}
}
