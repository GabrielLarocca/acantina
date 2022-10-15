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
use Illuminate\Support\Facades\Log;

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
		$carrinhoProdutos = CarrinhoProduto::where(["cart_id" => $carrinho->id])->with('produto')->get();
		$somaTotalCarrinho = 0;

		foreach ($carrinhoProdutos as $product) {
			$totalValue = number_format($product->produto->pro_price * $product->quantity, 2);

			$product->totalPrice = $totalValue;
		}

		foreach ($carrinhoProdutos as $product) {
			$somaTotalCarrinho = number_format($somaTotalCarrinho + $product->totalPrice, 2);
		}

		return response()->json(["total" => $somaTotalCarrinho, "data" => $carrinhoProdutos]);
	}

	public function destroy(Request $request, $id) {
		$carrinho = Carrinho::where(["car_user_id" => $request->user()->id])->firstOrFail();
		$carrinhoProduto = CarrinhoProduto::where(["product_id" => $id, "cart_id" => $carrinho->id])->first();

		$carrinhoProduto->delete();

		return response(null, 200);
	}
}
