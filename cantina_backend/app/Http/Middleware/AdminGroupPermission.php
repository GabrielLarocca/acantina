<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\GroupPermission;

class AdminGroupPermission {
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle(Request $request, Closure $next) {
		if (auth()->user()->tokenCan('api:admin')) {
			return $next($request);
		}

		return response(null, 403);
	}
}
