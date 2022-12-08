<?php

namespace App\Http\Controllers\Web;

use App\Helpers\StripeUtil;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Helpers\Utils;
use App\Models\Carrinho;
use App\Models\CarrinhoProduto;
use App\Models\Cupom;
use App\Models\CupomUsuario;
use App\Models\Pedido;
use App\Models\User;
use Illuminate\Container\Container;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Log;

class PedidoController extends Controller {

	public function store(Request $request) {
		$errors = array();

		$validator = Validator::make($request->all(), [
			'ord_type_payment' => 'required'
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->getMessages() as $item) {
				array_push($errors, $item[0]);
			}

			return response()->json(['errors' => $errors], 422);
		}

		$carrinho = Carrinho::where(["car_user_id" => $request->user()->id])->with('produtos')->firstOrFail();
		$carrinhoProdutos = CarrinhoProduto::where(["cart_id" => $carrinho->id])->with('produto')->get();
		$somaTotalCarrinho = 0;
		$cupom = null;

		if (isset($request->cupom)) {
			$cupom = Cupom::where(['cou_code' => $request->cupom])->first();

			$cupomUsuario = CupomUsuario::where(['user_id' => $request->user()->id, 'coupon_id' => $cupom->id])->first();

			if ($cupomUsuario) {
				array_push($errors, "Não foi possivel aplicar este cupom, ele já foi utilizado.");

				return response()->json(['errors' => $errors], 422);
			} else {
				$obj = new CupomUsuario();

				$obj->coupon_id = $cupom->id;
				$obj->user_id = $request->user()->id;

				$obj->save();
			}
		}

		foreach ($carrinhoProdutos as $product) {
			$totalValue = number_format($product->produto->pro_price * $product->quantity, 2);

			$product->totalPrice = $totalValue;
		}

		foreach ($carrinhoProdutos as $product) {
			$somaTotalCarrinho = number_format($somaTotalCarrinho + $product->totalPrice, 2);
		}

		if (isset($cupom)) {
			$somaTotalCarrinho = number_format($somaTotalCarrinho - $cupom->cou_discount, 2);
		}

		$response;

		if ($request->ord_type_payment == "credit-card") {
			$products = [];

			foreach ($carrinhoProdutos as $produto) {
				array_push($products, [
					'price' => $produto->produto->pro_stripe_price_id,
					'quantity' => $produto->quantity,
				]);
			}

			$response = StripeUtil::createSubmit($request->user(), $products);
		}

		$nfe = [
			"data" => $carrinhoProdutos,
			"total" => $somaTotalCarrinho,
			"desconto" => $cupom ? $cupom : null
		];

		$nfe = json_encode($nfe);

		$obj = new Pedido();

		if ($request->ord_cupom_id) {
			$obj->ord_cupom_id = $request->ord_cupom_id;
		}

		$obj->ord_cart_id = $carrinho->id;
		$obj->ord_total = $somaTotalCarrinho;
		$obj->ord_user_id = $request->user()->id;
		$obj->ord_state_payment = "não pago";
		$obj->ord_state_order = "aguardando";
		$obj->ord_type_payment = $request->ord_type_payment;
		$obj->ord_nf = $nfe;


		$obj->save();

		foreach ($carrinhoProdutos as $carrinhoProduto) {
			$carrinhoProduto->delete();
		}

		if (isset($response)) {
			$obj->stripe = $response;
		}

		return response()->json($obj);
	}

	public function list(Request $request) {
		$pedidos = Pedido::where(["ord_user_id" => $request->user()->id])->orderBy('id', 'desc')->get();

		return response()->json($pedidos);
	}

	public function get(Request $request, $id) {
		return response()->json(Pedido::where(["id" => $id])->firstOrFail());
	}

	public function destroy(Request $request, $id) {
		$pedido = Pedido::where(["id" => $id, "ord_user_id" => $request->user()->id])->firstOrFail();

		if ($pedido->ord_state_order == "aguardando" && $pedido->ord_state_payment != "pago") {
			$pedido->ord_state_order = "cancelado";

			$pedido->save();

			return response(null, 200);
		} else {
			return response()->json(['errors' => ["O pedido não pode ser cancelado, entre em contato com a cantina!"]], 422);
		}
	}

	public function checkCupom(Request $request) {
		$cupom = Cupom::where(['cou_code' => $request->cupom])->first();

		$errors = array();

		if (!isset($cupom)) {
			array_push($errors, "Este cupom não existe.");

			return response()->json(['errors' => $errors], 422);
		}

		$cupomUsuario = CupomUsuario::where(['user_id' => $request->user()->id, 'coupon_id' => $cupom->id])->first();

		if ($cupomUsuario) {
			array_push($errors, "Não foi possivel aplicar este cupom, ele já foi utilizado.");

			return response()->json(['errors' => $errors], 422);
		} else {
			return response()->json($cupom);
		}
	}
}
