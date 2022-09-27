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
			$controller = get_class($request->route()->getController());
			$method = $request->route()->getActionMethod();

			$group = Group::where(['id' => auth()->user()->adm_id_group, 'gro_active' => 1])->first();

			if (!empty($group)) {
				$permission = GroupPermission::where(['grp_id_group' => $group->id, 'grp_controller' => $controller, 'grp_method' => $method])->first();

				if (!empty($permission)) {
					return $next($request);
				}
			}
		}

		return response(null, 403);
	}
}
