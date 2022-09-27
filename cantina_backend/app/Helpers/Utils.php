<?php

namespace App\Helpers;

use DateTime;
use DateTimeZone;
use App\Models\File;
use App\Helpers\S3Util;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;

class Utils {
	
	static public function addAttachment($file) {
		$imageName = time() . "-" . rand(1000, 1000000) . '.' . $file->getClientOriginalExtension();

		$att = new File;

		$att->fil_name = $imageName;
		$att->fil_size = filesize($file);

		S3Util::putObject($att->fil_name, file_get_contents($file));

		$att->save();

		return $att;
	}

	static function parseDateTime($string, $timeZone = null) {
		$date = new DateTime($string, $timeZone ? $timeZone : new DateTimeZone('UTC'));

		if ($timeZone) {
			$date->setTimezone($timeZone);
		}

		return $date;
	}

	static function clearString($string) {
		$string = str_replace(' ', '', $string);
		$string = str_replace('-', '', $string);
		$string = preg_replace('/[^A-Za-z0-9\-]/', '', $string);

		return preg_replace('/-+/', '-', $string);
	}

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
