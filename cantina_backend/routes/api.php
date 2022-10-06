<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\CarrinhoController;

use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\ProdutoController as AdminProdutoController;
use App\Http\Controllers\Admin\UsuarioController as AdminUsuarioController;
use App\Http\Controllers\Admin\CupomController as AdminCupomController;
use App\Http\Controllers\Admin\PedidoController as AdminPedidoController;

/*
  |--------------------------------------------------------------------------
  | API Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register API routes for your application. These
  | routes are loaded by the RouteServiceProvider within a group which
  | is assigned the "api" middleware group. Enjoy building your API!
  |
 */

Route::group(['prefix' => 'web'], function () {
	Route::post('/auth', [AuthController::class, 'auth']);
	Route::post('/register', [AuthController::class, 'register']);

	Route::post('/forgot-password', [AuthController::class, 'sendEmail']);
	Route::post('/reset-password', [AuthController::class, 'resetPassword']);

	Route::group(['middleware' => ['auth:sanctum', 'user']], function () {
		/*authenticated routes*/
		Route::group(['prefix' => 'pedido'], function () {
			// Route::post('/', [PedidoController::class, 'store']);
			// Route::post('/list', [PedidoController::class, 'list']);
			// Route::get('/{id}', [PedidoController::class, 'get']);
			// Route::delete('/{id}', [PedidoController::class, 'destroy']);
		});

		Route::group(['prefix' => 'carrinho'], function () {
			Route::post('/', [CarrinhoController::class, 'store']);
			Route::post('/list', [CarrinhoController::class, 'list']);
			Route::get('/{id}', [CarrinhoController::class, 'get']);
			Route::delete('/{id}', [CarrinhoController::class, 'destroy']);
		});
	});
});

Route::group(['prefix' => 'admin'], function () {
	Route::post('/auth', [AdminAuthController::class, 'auth']);
	Route::post('/register', [AdminAuthController::class, 'register']);

	Route::group(['middleware' => ['auth:sanctum', 'admin']], function () {
		/*authenticated routes*/
		Route::group(['prefix' => 'produto'], function () {
			Route::post('/', [AdminProdutoController::class, 'store']);
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
			Route::post('/', [AdminUsuarioController::class, 'store']);
			Route::post('/list', [AdminUsuarioController::class, 'list']);
			Route::get('/{id}', [AdminUsuarioController::class, 'get']);
			Route::delete('/{id}', [AdminUsuarioController::class, 'destroy']);
		});

		Route::group(['prefix' => 'pedido'], function () {
			Route::post('/', [AdminPedidoController::class, 'store']);
			Route::post('/list', [AdminPedidoController::class, 'list']);
			Route::get('/{id}', [AdminPedidoController::class, 'get']);
			Route::delete('/{id}', [AdminPedidoController::class, 'destroy']);
		});
	});
});
