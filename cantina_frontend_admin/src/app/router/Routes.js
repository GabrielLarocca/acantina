import React from "react";
import { Route, Routes as Switch } from "react-router-dom";
import { isAuthenticated } from "../utils/utils";

import ErrorsPage from "../pages/errors/ErrorsPage";

import AuthPage from "../pages/auth/AuthPage";
import Dashboard from "../pages/dashboard/Dashboard";

import PedidosIndex from "../pages/dashboard/pedidos/PedidosIndex";
import ProdutosIndex from "../pages/dashboard/produtos/ProdutosIndex";
import CuponsIndex from "../pages/dashboard/cupons/CuponsIndex";
import UsuariosIndex from "../pages/dashboard/usuarios/UsuariosIndex";

const Routes = () => {
	return (
		<Switch>
			{!isAuthenticated() ?
				<Route exact path="/" element={<AuthPage />} />
				:
				(
					<>
						<Route exact path="/dashboard" element={<Dashboard />} />
						<Route exact path="/pedidos" element={<PedidosIndex />} />
						<Route exact path="/produtos" element={<ProdutosIndex />} />
						<Route exact path="/cupons" element={<CuponsIndex />} />
						<Route exact path="/usuarios" element={<UsuariosIndex />} />
					</>


				)}

			<Route path="/error" element={ErrorsPage} />
		</Switch>
	);
};

export default Routes;