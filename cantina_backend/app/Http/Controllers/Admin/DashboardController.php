<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Pedido;
use App\Models\Produto;
use App\Models\Usuario;

class DashboardController extends Controller {
	// TODO VAI TER DASHBOARD?
	public function get(Request $request) {
		$total_users = Usuario::where(['usr_active' => 1])->count();
		$total_pedidos = Pedido::count();
		$total_produtos = Produto::count();

		return response()->json([
			'total_users' => $total_users,
			'total_pedidos' => $total_pedidos,
			'total_produtos' => $total_produtos
		]);
	}
}
