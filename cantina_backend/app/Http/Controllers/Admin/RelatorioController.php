<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Utils;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Pedido;
use App\Models\Produto;
use App\Models\Usuario;
use Carbon\Carbon;

class RelatorioController extends Controller {

	public function getRelatorioGeral(Request $request) {
		$total_users = Usuario::where(['usr_active' => 1])->count();
		$total_pedidos = Pedido::count();
		$total_produtos = Produto::count();

		$vendasHoje = Pedido::whereDate('created_at', '=', Carbon::today()->toDateString())->count();
		$vendasSemana = Pedido::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count();
		$vendasMes = Pedido::whereMonth('created_at', Carbon::now()->month)->count();
		$vendasAno = Pedido::whereBetween('created_at', [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()])->count();

		Carbon::setWeekStartsAt(Carbon::MONDAY); //segunda começa semana
		Carbon::setWeekEndsAt(Carbon::SUNDAY); //domingo termina

		return response()->json([
			'total_users' => $total_users,
			'total_pedidos' => $total_pedidos,
			'total_produtos' => $total_produtos,
			"vendaHoje" => $vendasHoje,
			"vendaSemana" => $vendasSemana,
			"vendaMes" => $vendasMes,
			"vendaAno" => $vendasAno
		]);
	}

	public function getRelatorio1(Request $request) {
		$columnsToFilter = ['ord_cart_id', 'ord_total', 'ord_user_id', 'ord_state_payment', 'ord_state_order', 'ord_nf'];

		$with  = ['usuario', 'cupom'];

		$wheres = array(
			'ord_state_order' => 'finalizado'
		);

		return response()->json([
			"data" => Utils::createDataTableResult($request, Pedido::class, $wheres, $columnsToFilter, null, null, null, $with),
		]);
	}
}
