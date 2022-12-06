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
		$columnsToFilter = ['ord_cart_id', 'ord_total', 'ord_user_id', 'ord_state_payment', 'ord_state_order', 'ord_nf'];

		$with  = ['usuario', 'cupom'];

		$wheres = array('ord_state_order' => 'aguardando');

		return response()->json(["data" => Utils::createDataTableResult($request, Pedido::class, $wheres, $columnsToFilter, null, null, null, $with)]);
	}

	public function listConcluidos(Request $request) {
		$columnsToFilter = ['ord_cart_id', 'ord_total', 'ord_user_id', 'ord_state_payment', 'ord_state_order', 'ord_nf'];

		$with  = ['usuario', 'cupom'];

		$wheres = array(
			'ord_state_order' => 'finalizado'
		);

		return response()->json(["data" => Utils::createDataTableResult($request, Pedido::class, $wheres, $columnsToFilter, null, null, null, $with)]);
	}

	public function get(Request $request, $id) {
		return response()->json(Pedido::where(["id" => $id])->with('usuario', 'carrinho', 'cupom')->firstOrFail());
	}

	public function store(Request $request) {
		// $this->validate($request, [
		// 'ord_withdrawal_date' => 'required',
		// 'ord_cart_id' => 'required',
		// 'ord_user_id' => 'required',
		// 'ord_cupom_id' => 'required',
		// 'ord_state_payment' => 'required',
		// 'ord_state_order' => 'required',
		// ]);

		// $obj = new Pedido;

		// $q = Carrinho::where(["car_user_id" =>  $request->ord_user_id])->firstOrFail();

		// $obj->ord_cupom_id = $request->ord_cupom_id;
		// $obj->ord_withdrawal_date = $request->ord_withdrawal_date;
		// $obj->ord_cart_id = $request->ord_cart_id;
		// $obj->ord_user_id = $request->ord_user_id;
		// $obj->ord_state_payment = $request->ord_state_payment;
		// $obj->ord_state_order = $request->ord_state_order;
		// $obj->ord_nf = $request->ord_nf;

		// $file = Utils::addAttachment($request->thumbnail);

		// $obj->save();

		// return response()->json($obj);
	}

	public function update(Request $request) {
		$obj = Pedido::where(['id' => $request->id])->with('usuario')->firstOrFail();

		if (isset($request->ord_state_order)) {
			$obj->ord_state_order = $request->ord_state_order;
		}

		if (isset($request->ord_state_payment)) {
			$obj->ord_state_payment = $request->ord_state_payment;
		}

		// $this->sendNotification($obj->usuario->id);

		$obj->save();

		return response()->json($obj);
	}

	public function sendNotification($userID) {
		$SERVER_API_KEY = config('app.firebase_serverapiKey');

		$data = [
			"to" => '',
			"notification" => [
				"title" => 'Pedido pronto!',
				"body" => 'Seu pedido está pronto, compareça a cantina para fazer a retirada',
				"content_available" => true,
				"priority" => "high",
			]
		];

		$dataString = json_encode($data);

		$headers = [
			'Authorization: key=' . $SERVER_API_KEY,
			'Content-Type: application/json',
		];

		$ch = curl_init();

		curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $dataString);

		$response = curl_exec($ch);

		Log::info($response);
	}

	public function destroy(Request $request, $id) {
	}
}
