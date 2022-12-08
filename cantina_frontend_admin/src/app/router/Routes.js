import React from "react";
import { Navigate, Route, Routes as Switch } from "react-router-dom";
import { useSelector } from "react-redux";

import ErrorsPage from "../pages/errors/ErrorsPage";

import AuthPage from "../pages/auth/AuthPage";
// import Dashboard from "../pages/dashboard/Dashboard";

import PedidosIndex from "../pages/dashboard/pedidos/PedidosIndex";
import ProdutosIndex from "../pages/dashboard/produtos/ProdutosIndex";
import CuponsIndex from "../pages/dashboard/cupons/CuponsIndex";
import UsuariosIndex from "../pages/dashboard/usuarios/UsuariosIndex";
import Logout from "../pages/auth/Logout";
import ProdutosNew from "../pages/dashboard/produtos/ProdutosNew";
import ProdutosEdit from "../pages/dashboard/produtos/ProdutosEdit";
import CuponsNew from "../pages/dashboard/cupons/CuponsNew";
import CategoriasIndex from "../pages/dashboard/categorias/CategoriasIndex";
import CategoriasNew from "../pages/dashboard/categorias/CategoriasNew";
import RelatorioIndex from "../pages/dashboard/relatorios/RelatoriosIndex";

const Routes = () => {
	const { isAuthorized } = useSelector(({ auth }) => ({ isAuthorized: auth.user != null }));


	return (
		<Switch>
			{!isAuthorized ?
				<>
					<Route path="/" element={<Navigate to={'/auth'} />} />
					<Route exact path="/auth" element={<AuthPage />} />
				</>
				:
				(
					<>
						<Route exact path="/dashboard" element={<Navigate to={'/pedidos'} />} />
						<Route exact path="/" element={<Navigate to={'/pedidos'} />} />

						{/* <Route exact path="/dashboard" element={<Dashboard />} /> */}

						{/* pedidos crud */}
						<Route exact path="/pedidos" element={<PedidosIndex />} />
						<Route exact path="/pedidos/new" element={<PedidosIndex />} />
						<Route path="/pedidos/edit/:id" element={<PedidosIndex />} />

						{/* produtos crud */}
						<Route exact path="/produtos" element={<ProdutosIndex />} />
						<Route exact path="/produtos/new" element={<ProdutosNew />} />
						<Route path="/produtos/edit/:id" element={<ProdutosEdit />} />

						{/* cupons crud */}
						<Route exact path="/cupons" element={<CuponsIndex />} />
						<Route exact path="/cupons/new" element={<CuponsNew />} />

						{/* categorias crud */}
						<Route exact path="/categorias" element={<CategoriasIndex />} />
						<Route exact path="/categorias/new" element={<CategoriasNew />} />

						{/* relatorio */}
						<Route exact path="/relatorios" element={<RelatorioIndex />} />

						{/* usuario crud */}
						<Route exact path="/clientes" element={<UsuariosIndex />} />

						<Route exact path="/logout" element={<Logout />} />
					</>


				)}

			<Route path="/error" element={ErrorsPage} />
		</Switch>
	);
};

export default Routes;