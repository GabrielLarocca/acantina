import React, { useState } from "react";
import Layout from "../../../../layout/Layout";
import { getDataTable, getDataTableConcluidos } from "../../../crud/pedido.crud";
import BetterPedidoTable from "../../../components/BetterPedidoTable";

export default function PedidosIndex() {
	const [abaPedido, setAbaPedido] = useState('agora');

	return (
		<Layout title={'Pedidos'}>
			<div className="abas">
				<div className={abaPedido == 'agora' ? 'selected' : ''} onClick={() => setAbaPedido('agora')}>agora</div>
				{/* <div>Agendados</div> */}
				<div className={abaPedido == 'concluido' ? 'selected' : ''} onClick={() => setAbaPedido('concluido')}>concluido</div>
			</div>

			{abaPedido == 'agora' &&
				<BetterPedidoTable btnTitle="pedido" noHeaderNewbtn fetchEvent={getDataTable} crudUrl={"/pedidos"} idRow={`id`} />
			}

			{abaPedido == 'concluido' &&
				<BetterPedidoTable btnTitle="pedido" noHeaderNewbtn fetchEvent={getDataTableConcluidos} crudUrl={"/pedidos"} idRow={`id`} />
			}
		</Layout>
	)
};