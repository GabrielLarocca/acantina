import React from "react";
import PriceTag3FillIcon from 'remixicon-react/PriceTag3FillIcon';
import CalendarTodoFillIcon from 'remixicon-react/CalendarTodoFillIcon';
import Coupon3FillIcon from 'remixicon-react/Coupon3FillIcon';
import User3FillIcon from 'remixicon-react/User3FillIcon';
import Dashboard2FillIcon from 'remixicon-react/Dashboard2FillIcon';
import LogoutBoxLineIcon from 'remixicon-react/LogoutBoxLineIcon';
import { Link } from "react-router-dom";

// import Header from "./header/Header";
// import Footer from "./footer/Footer";

export default function Layout({ children, title }) {
	const pages = [
		{ name: 'Dashboard', path: '/dashboard' },
		{ name: 'Pedidos', path: '/pedidos' },
		{ name: 'Produtos', path: '/produtos' },
		{ name: 'Cupons', path: '/cupons' },
		{ name: 'Usuários', path: '/usuarios' },
	]

	const iconSwitch = (icon) => {
		switch (icon) {
			case 'Dashboard':
				return <Dashboard2FillIcon size={16} />

			case 'Pedidos':
				return <CalendarTodoFillIcon size={16} />

			case 'Produtos':
				return <PriceTag3FillIcon size={16} />

			case 'Cupons':
				return <Coupon3FillIcon size={16} />

			case 'Usuários':
				return <User3FillIcon size={16} />

			default:
				break;
		}
	}

	return (
		<div className="layout-admin">
			<div className="menu-left">
				<div className="logo" style={{ backgroundImage: 'url(images/ACantina_logoWhite.svg)' }} />

				{pages.map((page, index) => (
					<Link to={page.path}>
						<div className={`navbar-item ${window?.location?.href.includes(page.path) && 'navbar-active'} `}>
							{iconSwitch(page.name)}

							<p>{page.name}</p>
						</div>
					</Link>
				))}

				<div className="leave-container">
					<hr />

					<div className={`navbar-item`}>
						<LogoutBoxLineIcon size={16} color='#A4A6A7' />

						<p>Sair</p>
					</div>
				</div>
			</div>

			<div className="container-page-admin">
				<h3>{title}</h3>

				{children}
			</div>
		</div>
	)
}