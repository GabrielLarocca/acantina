<?php

namespace App\Helpers;

use DateTime;
use DateTimeZone;
use App\Models\File;
use App\Models\Arquivo;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;

class Utils {

	static public function createDataTableResult(Request $request, $model, $wheres, $columnsToFilter, $columnsRelationshipToFilter = null, $sortField = '', $sortOrder = 'asc', $with = null, $join = null) {
		$currentPage = $request->page + 1;

		Paginator::currentPageResolver(function () use ($currentPage) {
			return $currentPage;
		});

		if (sizeof($wheres) > 0) {
			if (isset($join)) {
				$query = $model::join($join->table, $join->key_1, $join->condition, $join->key_2)->where($wheres);
			} else {
				$query = $model::where($wheres);
			}
		}

		if (isset($with)) {
			$query->with($with);
		}

		if (trim($request->globalFilter) != "") {
			$query->where(function ($q) use ($columnsToFilter, $columnsRelationshipToFilter, $request) {

				if (isset($columnsToFilter)) {
					foreach ($columnsToFilter as $c) {
						$q->orWhere($c, 'LIKE', '%' . $request->globalFilter . '%');
					}
				}

				if (isset($columnsRelationshipToFilter)) {
					foreach ($columnsRelationshipToFilter as $key => $value) {
						$q->orWhereHas($key, function ($r) use ($value, $request) {
							$r->where($value, 'LIKE', '%' . $request->globalFilter . '%');
						});
					}
				}
			});
		}

		if (trim($sortField != "")) {
			$query->orderBy($sortField, $sortOrder);
		}

		$result = $query->paginate($request->rows);

		foreach ($result as &$r) {
			if (!empty($r->created_at)) {
				$r->created_at_format = Carbon::parse($r->created_at)->format('m/d/Y H:i:s');
			}

			if (!empty($r->updated_at)) {
				$r->updated_at_format = Carbon::parse($r->updated_at)->format('m/d/Y H:i:s');
			}
		}

		return $result;
	}
}
