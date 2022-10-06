<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Helpers\Utils;
use App\Models\Carrinho;
use App\Models\CarrinhoProduto;
use App\Models\User;
use Illuminate\Container\Container;
use Illuminate\Pagination\Paginator;

class CarrinhoController extends Controller {

	public function store(Request $request) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'product_id' => 'required',
			'quantity' => 'required'
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors], 422);
		}

		$carrinho = Carrinho::where(["car_user_id" => $request->user()->id])->with('produtos')->firstOrFail();
		$carrinhoProdutos = CarrinhoProduto::where(["product_id" => $request->product_id, "cart_id" => $carrinho->id])->first();

		if (!isset($carrinhoProdutos)) {
			$query = new CarrinhoProduto();

			$query->product_id = $request->product_id;
			$query->quantity = $request->quantity;
			$query->cart_id = $carrinho->id;

			$query->save();

			return response()->json($query);
		} else {
			$carrinhoProdutos->quantity = $carrinhoProdutos->quantity + $request->quantity;

			$carrinhoProdutos->save();

			return response()->json($carrinhoProdutos);
		}
	}

	public function list(Request $request) {
		$carrinho = Carrinho::where(["car_user_id" => $request->user()->id])->firstOrFail();
		$carrinhoProdutos = CarrinhoProduto::where(["cart_id" => $carrinho->id])->with('produto');

		$currentPage = $request->page + 1;
		$rows = 20;

		Paginator::currentPageResolver(function () use ($currentPage) {
			return $currentPage;
		});

		$carrinhoProdutos = $carrinhoProdutos->paginate($rows);

		return response()->json($carrinhoProdutos);
	}

	public function update(Request $request, $id) {
		// $errors = array();

		// $validator = Validator::make($request->all(), [
		// 	'usr_name' => 'required',
		// 	'email' => 'required|email|unique:users,email,' . $id,
		// 	'usr_phone' => 'required|numeric'
		// ]);

		// if ($validator->fails()) {
		// 	foreach ($validator->errors()->getMessages() as $item) {
		// 		array_push($errors, $item[0]);
		// 	}

		// 	return response()->json(['errors' => $errors], 422);
		// }

		// $patient = TherapistPatient::with('patient')->where(['thp_id_therapist' => $request->user()->id, 'thp_id_patient' => $id])->firstOrFail();
		// $usr = User::where('id', $patient->patient->id)->firstOrFail();

		// if ($request->file('usr_photo') != null) {
		// 	$validator = Validator::make($request->all(), [
		// 		'usr_photo' => 'required|mimes:jpeg,jpg,png|max:10240',
		// 	]);

		// 	if ($validator->fails()) {
		// 		foreach ($validator->errors()->getMessages() as $item) {
		// 			array_push($errors, $item[0]);
		// 		}

		// 		return response()->json(['errors' => $errors], 422);
		// 	}

		// 	$attachment = Utils::addAttachment($request->file('usr_photo'));

		// 	$usr->usr_id_photo = $attachment->id;
		// }

		// $usr->usr_name = $request->usr_name;
		// $usr->email = $request->email;
		// $usr->usr_phone = $request->usr_phone;

		// $usr->save();

		// return response()->json($usr);
	}

	public function destroy(Request $request, $id) {
		$carrinho = Carrinho::where(["car_user_id" => $request->user()->id])->firstOrFail();
		$carrinhoProduto = CarrinhoProduto::where(["product_id" => $id, "cart_id" => $carrinho->id])->first();

		$carrinhoProduto->delete();

		return response(null, 200);
	}
}
