import React, { useEffect, useState } from "react";
import Layout from "../../../../layout/Layout";
import { getDataTable, getDataTableConcluidos } from "../../../crud/pedido.crud";
import BetterDataTable from "../../../components/BetterDataTable";
import { Column } from "primereact/column";
import { formatBRL } from "../../../utils/Validation";
import moment from "moment";
import { getRelatorioGerais } from "../../../crud/relatorio.crud";

export default function RelatoriosIndex() {
	const [aba, setAba] = useState('Vendas');
	const [relatorioGerais, setRelatorioGerais] = useState(null);

	useEffect(() => {
		getRelatorioGerais().then(({ data }) => {
			setRelatorioGerais(data);
		})
	}, []);

	return (
		<Layout title={'Relatórios'}>
			<div className="containerWhite">
				<div className="whiteBox">
					<h3 className="title">Vendas Hoje</h3>
					<h4>{relatorioGerais?.vendaHoje}</h4>
				</div>

				<div className="whiteBox">
					<h3 className="title">Vendas Semana</h3>
					<h4>{relatorioGerais?.vendaSemana}</h4>
				</div>

				<div className="whiteBox">
					<h3 className="title">Vendas Mês</h3>
					<h4>{relatorioGerais?.vendaMes}</h4>
				</div>

				<div className="whiteBox">
					<h3 className="title">Vendas Ano</h3>
					<h4>{relatorioGerais?.vendaAno}</h4>
				</div>

				<div className="whiteBox">
					<h3 className="title">Usuarios</h3>
					<h4>{relatorioGerais?.total_users}</h4>
				</div>

				<div className="whiteBox">
					<h3 className="title">Pedidos</h3>
					<h4>{relatorioGerais?.total_pedidos}</h4>
				</div>

				<div className="whiteBox">
					<h3 className="title">Produtos</h3>
					<h4>{relatorioGerais?.total_produtos}</h4>
				</div>
			</div>


			<div className="abas">
				<div className={aba == 'Vendas' ? 'selected' : ''} onClick={() => setAba('Vendas')}>Vendas</div>

				<div className={aba == 'pedidos' ? 'selected' : ''} onClick={() => setAba('pedidos')}>Pedidos</div>
			</div>

			{aba == 'Vendas' &&
				<BetterDataTable btnTitle="pedido" fetchEvent={getDataTable} crudButtons={false} idRow={`id`}>
					<Column field="id" header="ID" />
					<Column field="usuario.usr_name" header="Cliente" />
					<Column field="ord_state_order" header="Status de produção" />
					<Column field="ord_state_payment" header="Status do pagamento" />

					<Column field="ord_total" header="Valor da venda" body={({ ord_total }) => formatBRL(ord_total)} />
					<Column field="created_at_format" header="Venda realizada em" />
				</BetterDataTable>
			}

			{aba == 'concluido' &&
				<BetterDataTable btnTitle="pedido" noHeaderNewbtn fetchEvent={getDataTableConcluidos} crudUrl={"/pedidos"} idRow={`id`} />
			}
		</Layout>
	)
};