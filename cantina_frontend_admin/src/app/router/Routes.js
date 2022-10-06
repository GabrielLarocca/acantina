import React from "react";
import { Navigate, Route, Routes as Switch } from "react-router-dom";
import { useSelector } from "react-redux";

import ErrorsPage from "../pages/errors/ErrorsPage";

import AuthPage from "../pages/auth/AuthPage";
import Dashboard from "../pages/dashboard/Dashboard";

import PedidosIndex from "../pages/dashboard/pedidos/PedidosIndex";
import ProdutosIndex from "../pages/dashboard/produtos/ProdutosIndex";
import CuponsIndex from "../pages/dashboard/cupons/CuponsIndex";
import UsuariosIndex from "../pages/dashboard/usuarios/UsuariosIndex";
import Logout from "../pages/auth/Logout";
import ProdutosNew from "../pages/dashboard/produtos/ProdutosNew";

const Routes = () => {
	const { isAuthorized } = useSelector(({ auth }) => ({ isAuthorized: auth.user != null }));


	return (
		<Switch>
			{!isAuthorized ?
				<Route exact path="/" element={<AuthPage />} />
				:
				(
					<>
						<Route exact path="/" element={<Navigate to={'/dashboard'} />} />

						<Route exact path="/dashboard" element={<Dashboard />} />

						<Route exact path="/pedidos" element={<PedidosIndex />} />

						<Route exact path="/produtos" element={<ProdutosIndex />} />
						<Route exact path="/produtos/new" element={<ProdutosNew />} />

						<Route exact path="/cupons" element={<CuponsIndex />} />

						<Route exact path="/usuarios" element={<UsuariosIndex />} />

						{/*<Route exact path="/logout" element={<Logout />} />*/}
					</>


				)}

			<Route path="/error" element={ErrorsPage} />
		</Switch>
	);
};

export default Routes;