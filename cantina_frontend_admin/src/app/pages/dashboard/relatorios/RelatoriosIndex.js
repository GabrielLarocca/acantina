import React, { useState } from "react";
import Layout from "../../../../layout/Layout";
import { getDataTable, getDataTableConcluidos } from "../../../crud/pedido.crud";
import BetterPedidoTable from "../../../components/BetterPedidoTable";

export default function RelatoriosIndex() {
	const [aba, setAba] = useState('agora');

	return (
		<Layout title={'Pedidos'}>
			<div className="abas">
				<div className={aba == 'produtos' ? 'selected' : ''} onClick={() => setAba('produtos')}>Produtos</div>
				{/* <div>Agendados</div> */}
				<div className={aba == 'pedidos' ? 'selected' : ''} onClick={() => setAba('pedidos')}>Pedidos</div>
			</div>

			{aba == 'agora' &&
				<BetterPedidoTable btnTitle="pedido" noHeaderNewbtn fetchEvent={getDataTable} crudUrl={"/pedidos"} idRow={`id`} />
			}

			{aba == 'concluido' &&
				<BetterPedidoTable btnTitle="pedido" noHeaderNewbtn fetchEvent={getDataTableConcluidos} crudUrl={"/pedidos"} idRow={`id`} />
			}
		</Layout>
	)
};