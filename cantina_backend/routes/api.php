<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\CarrinhoController;
use App\Http\Controllers\Web\CategoriaController;
use App\Http\Controllers\Web\ProdutosController;
use App\Http\Controllers\Web\PedidoController;
use App\Http\Controllers\Web\WebhookController;

use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\CategoriaController as AdminCategoriaController;
use App\Http\Controllers\Admin\ProdutoController as AdminProdutoController;
use App\Http\Controllers\Admin\UsuarioController as AdminUsuarioController;
use App\Http\Controllers\Admin\CupomController as AdminCupomController;
use App\Http\Controllers\Admin\PedidoController as AdminPedidoController;
use App\Http\Controllers\Admin\RelatorioController as AdminRelatorioController;

Route::post('/stripe/webhook', [WebhookController::class, 'handleWebhook']);

Route::group(['prefix' => 'web'], function () {
	Route::post('/auth', [AuthController::class, 'auth']);
	Route::post('/register', [AuthController::class, 'register']);

	Route::post('/forgot-password', [AuthController::class, 'sendEmail']);
	Route::post('/reset-password', [AuthController::class, 'resetPassword']);

	Route::post('/categoria/list', [CategoriaController::class, 'list']);

	Route::group(['prefix' => 'produtos'], function () {
		Route::post('/list', [ProdutosController::class, 'list']);
		Route::get('/{id}', [ProdutosController::class, 'get']);
	});

	Route::group(['middleware' => ['auth:sanctum', 'user']], function () {
		/*authenticated routes*/
		Route::group(['prefix' => 'user'], function () {
			Route::get('/', [AuthController::class, 'get']);
			Route::post('/edit', [AuthController::class, 'edit']);
		});

		Route::group(['prefix' => 'pedido'], function () {
			Route::post('/', [PedidoController::class, 'store']);
			Route::post('/list', [PedidoController::class, 'list']);
			Route::post('/checkCupom', [PedidoController::class, 'checkCupom']);
			Route::get('/{id}', [PedidoController::class, 'get']);
			Route::delete('/{id}', [PedidoController::class, 'destroy']);
		});

		Route::group(['prefix' => 'carrinho'], function () {
			Route::post('/', [CarrinhoController::class, 'store']);
			Route::post('/list', [CarrinhoController::class, 'list']);
			Route::delete('/{id}', [CarrinhoController::class, 'destroy']);
		});
	});
});

Route::group(['prefix' => 'admin'], function () {
	Route::post('/auth', [AdminAuthController::class, 'auth']);
	Route::post('/register', [AdminAuthController::class, 'register']); //ACESSADO APENAS POR ENDPOINT

	Route::group(['middleware' => ['auth:sanctum', 'admin']], function () {
		/*authenticated routes*/
		Route::group(['prefix' => 'categoria'], function () {
			Route::post('/', [AdminCategoriaController::class, 'store']);
			Route::post('/list', [AdminCategoriaController::class, 'list']);
			Route::post('/listSimple', [AdminCategoriaController::class, 'listSimple']);
			// Route::get('/{id}', [AdminCategoriaController::class, 'get']);
			Route::delete('/{id}', [AdminCategoriaController::class, 'destroy']);
		});

		Route::group(['prefix' => 'produto'], function () {
			Route::post('/', [AdminProdutoController::class, 'store']);
			Route::post('/edit', [AdminProdutoController::class, 'update']);
			Route::post('/list', [AdminProdutoController::class, 'list']);
			Route::get('/{id}', [AdminProdutoController::class, 'get']);
			Route::delete('/{id}', [AdminProdutoController::class, 'destroy']);
		});

		Route::group(['prefix' => 'cupom'], function () {
			Route::post('/', [AdminCupomController::class, 'store']);
			Route::post('/list', [AdminCupomController::class, 'list']);
			Route::get('/{id}', [AdminCupomController::class, 'get']);
			Route::delete('/{id}', [AdminCupomController::class, 'destroy']);
		});

		Route::group(['prefix' => 'usuario'], function () {
			Route::post('/list', [AdminUsuarioController::class, 'list']);
		});

		Route::group(['prefix' => 'pedido'], function () {
			Route::post('/listConcluidos', [AdminPedidoController::class, 'listConcluidos']);
			Route::post('/list', [AdminPedidoController::class, 'list']);
			Route::post('/editPedidoStatus', [AdminPedidoController::class, 'update']);
		});

		Route::group(['prefix' => 'relatorio'], function () {
			Route::get('/relatorioGeral', [AdminRelatorioController::class, 'getRelatorioGeral']);
			Route::post('/relatorio1', [AdminRelatorioController::class, 'getRelatorio1']);
			Route::post('/relatorio2', [AdminRelatorioController::class, 'getRelatorio2']);
		});
	});
});
