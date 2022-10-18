import React, { useState } from "react";
import Layout from "../../../../layout/Layout";
import BetterDataTable from "../../../components/BetterDataTable";
import { editPedidoStatus, getDataTable } from "../../../crud/pedido.crud";
import { Column } from 'primereact/column';
import { formatBRL } from "../../../utils/Validation";
import Swal from "sweetalert2";

export default function PedidosIndex() {
	const [pedidoState, setPedidoState] = useState([]);

	const bodyTableComponent = (pedido) => {
		const nf = JSON.parse(pedido?.ord_nf);

		// const getTable = () => {

		// }

		return (
			<div className="cardPedido" onClick={() => setPedidoState({ pedido, nf })}>
				<h3>Pedido #{pedido?.id}</h3>
				<p>{pedido?.created_at_format} | {nf?.data?.length} ite{nf?.data?.length > 1 ? 'ns' : 'm'}</p>
			</div>
		)
	}

	const handleFinalizarPedido = (values) => {
		editPedidoStatus(values).then(res => {
			if (res.status == 200) {
				return Swal.fire('Ok', 'Tudo certo, o status foi atualizado.', 'success');
			} else {
				return Swal.fire('Ops', res.data.errors[0] ?? 'Parece que houve um problema. Por favor, entre em contato com o suporte.', 'error');
			}
		}).catch(() => {
			return Swal.fire('Ops', 'Parece que houve um problema. Por favor, entre em contato com o suporte.', 'error');
		}).finally(() => {
		});
	}

	return (
		<Layout title={'Pedidos'}>
			<div className="tableWrapper">
				<BetterDataTable btnTitle="pedido" noHeaderNewbtn fetchEvent={getDataTable} crudUrl={"/pedidos"} idRow={`id`}>
					<Column field="object" body={(obj) => bodyTableComponent(obj)} />
				</BetterDataTable>

				<div className="pedidoDetalhes">
					{pedidoState.pedido ?
						<>
							<h3>Pedido #{pedidoState?.pedido?.id}</h3>
							<p>Pedido realizado em: <b>{pedidoState?.pedido?.created_at_format}</b></p>
							{pedidoState?.pedido?.usuario && (
								<p>Cliente: <b>{pedidoState?.pedido?.usuario?.usr_name}</b></p>
							)}

							<div className="tableDetalhe">
								<div className="headerDetalhe">
									<p>{pedidoState?.pedido?.ord_state_order == "aguardando" ? 'Em aberto' : 'Fechado'}</p>
								</div>

								{pedidoState?.nf.data.map((produto, index) => (
									<div key={index} className="bodyDetalhe">
										<div className="assets">
											<p>{produto.quantity}x</p>
											<h5>{produto.produto.pro_name}</h5>
										</div>

										<p className="price">{formatBRL(produto.produto?.pro_price)}</p>
									</div>
								))}

								<div className="footerDetalhe">
									<p>Total</p>

									<p className="price">{formatBRL(pedidoState?.nf?.total)}</p>
								</div>

								<div className="finalizarPedido">
									<p>{pedidoState?.pedido?.ord_state_payment == 'pago' ? 'Pagamento realizado' :
										<button onClick={() => handleFinalizarPedido({ ord_state_payment: 'pago', id: pedidoState?.pedido?.id })} className={`btn btn-primary btn-elevate btnPrimario`}>
											Confirmar Pagamento
										</button>
									}</p>

									{pedidoState?.pedido?.ord_state_order == "aguardando" ?
										<button onClick={() => handleFinalizarPedido({ ord_state_order: 'finalizado', id: pedidoState?.pedido?.id })} className={`btn btn-primary btn-elevate btnPrimario`}>
											Pedido está pronto
										</button>
										:
										<p className="finalizado">Pedido finalizado.</p>
									}
								</div>
							</div>
						</>
						: null}
				</div>
			</div>
		</Layout>
	)
};