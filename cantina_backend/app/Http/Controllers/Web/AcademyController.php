<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Academy;
use Illuminate\Pagination\Paginator;

class AcademyController extends Controller {
	public function list(Request $request) {
		$currentPage = $request->page + 1;

		Paginator::currentPageResolver(function () use ($currentPage) {
			return $currentPage;
		});

		$q = Academy::with('photo')->orderBy('created_at', 'desc');

		$academy = $q->paginate($request->rows);

		return response()->json($academy);
	}

	public function get(Request $request, $id) {
		return response()->json(Academy::with(['photo', 'video'])->where(["aca_active" => 1, "id" => $id])->firstOrFail());
	}
}
