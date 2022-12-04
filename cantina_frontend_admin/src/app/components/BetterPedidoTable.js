import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Link } from "react-router-dom";
import { Column } from 'primereact/column';
import Swal from 'sweetalert2';
import AddFillIcon from 'remixicon-react/AddFillIcon';
import EditBoxLineIcon from 'remixicon-react/EditBoxLineIcon';
import DeleteBinLineIcon from 'remixicon-react/DeleteBinLineIcon';
import { TextField } from '@material-ui/core';
import { formatBRL } from '../utils/Validation';
import { editPedidoStatus } from '../crud/pedido.crud';
import { toast } from 'react-toastify';

export default class BetterPedidoTable extends Component {
	constructor() {
		super();

		this.state = {
			data: [],
			rows: 10,
			totalRecords: 0,
			first: 0,
			last: 0,
			loading: false,
			globalFilter: null,
			pedidoState: {}
		};

		this.onPage = this.onPage.bind(this);
	}

	componentDidMount() {
		// setInterval(() => {
		this.onPage(this.state);
		// }, [30000])
	}

	doGlobalFiltering(value) {
		this.setState({ globalFilter: value });

		setTimeout(() => {
			let event = { ...this.state, globalFilter: value };
			this.onPage(event);
		}, 350);
	}

	refreshTable() {
		this.onPage(this.state);
	}

	onPage = (event) => {
		if (event.data) {
			event.data = null;
		}

		this.setState({
			...this.state,
			rows: event.rows,
			loading: true
		});

		this.props.fetchEvent(event).then(res => {
			let array = [];

			res.data.data.data.map((data) => {
				if (data.ord_state_payment === "não pago" && data.ord_type_payment === 'credit-card') {
					return;
				} else {
					array.push(data)
				}
			});

			this.setState({
				...this.state,
				data: array,
				totalRecords: res.data.data.total,
				first: res.data.data.from - 1,
				last: res.data.data.to - 1,
				loading: false
			});
		});
	};

	handleDelete = id => {
		Swal.fire({
			title: 'Atenção!',
			text: `Tem certeza que deseja remover esse ${this.props.btnTitle}?`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			cancelButtonText: "Não",
			confirmButtonText: 'Sim'
		}).then((result) => {
			if (result.value) {
				if (this.props.deleteHandler) {
					this.setState({ loading: true });

					this.props.deleteHandler(id).then(() => {
						this.refreshTable();

						this.setState({ loading: false });

						return toast('Tudo certo, o pedido foi removido.', { type: "success" });
					}).catch((err) => {
						Swal.fire('Ops!', `Houve um problema ao remover o ${this.props.btnTitle}. Entre em contato com o suporte.`, 'error');
						this.setState({ loading: false });
					});
				} else {
					alert("Nenhum método de remoção definido.");
				}
			}
		});
	};

	columnOpcoesCrud = (rowData, column) => {
		let idRow = this.props.idRow ? this.props.idRow : 'id';

		if (this.props.crudUrl) {
			return (
				<div style={{ textAlign: 'center' }}>
					{!this.props.noEdit ?
						<Link to={`${this.props.crudUrl}/edit/${rowData[idRow]}`} className="btn btn-success btn-table-action"><EditBoxLineIcon color='#FFF' size={18} /></Link>
						: null
					}

					{!this.props.noShow ?
						<Link to={`${this.props.crudUrl}/show/${rowData[idRow]}`} className="btn btn-primary btn-table-action"><i className="fa-solid fa-eye"></i></Link>
						: null
					}

					{!this.props.noDelete ?
						<button onClick={() => this.handleDelete(rowData[idRow])} className="btn btn-danger btn-table-action"><DeleteBinLineIcon color='#FFF' size={18} /></button>
						: null
					}

					{this.props.moreOptions ?
						this.props.moreOptions(rowData[idRow])
						: null
					}

				</div>
			);
		} else {
			return null;
		}
	};

	handleFinalizarPedido = (values) => {
		let pedido = { ...this.state.pedidoState }

		pedido.pedido.ord_state_order = values?.ord_state_order;
		pedido.pedido.ord_state_payment = values?.ord_state_payment;

		editPedidoStatus(values).then(res => {
			if (res.status == 200) {
				this.setState({ pedidoState: pedido })

				this.refreshTable();

				return toast('Tudo certo, o status foi atualizado.', { type: "success" });
			} else {
				return Swal.fire('Ops', res.data.errors[0] ?? 'Parece que houve um problema. Por favor, entre em contato com o suporte.', 'error');
			}
		}).catch(() => {
			return Swal.fire('Ops', 'Parece que houve um problema. Por favor, entre em contato com o suporte.', 'error');
		}).finally(() => {
		});
	}

	bodyTableComponent = (pedido) => {
		const nf = JSON.parse(pedido?.ord_nf);

		if (pedido.ord_state_payment === "não pago" && pedido.ord_type_payment === 'credit-card') {
			return <></>
		}

		return (
			<div className="cardPedido" onClick={() => this.setState({ pedidoState: { pedido, nf } })}>
				<h3>Pedido #{pedido?.id}</h3>
				<p>{pedido?.created_at_format} | {nf?.data?.length} ite{nf?.data?.length > 1 ? 'ns' : 'm'}</p>
			</div>
		)
	}

	render() {
		const header = (
			<div>
				{this.props.noHeader ? null :
					(
						<div className="d-flex">
							{this.props.noHeaderNewbtn ? null : (
								<Link to={`${this.props.crudUrl}/new`}>
									<button className={`btn btn-primary btn-elevate btnPrimario`}>
										<AddFillIcon color="#fff" size={18} style={{ marginRight: 12 }} />
										Adicionar {this.props.btnTitle}
									</button>
								</Link>
							)}

							<div className="form-group d-flex flex-column" style={{ marginLeft: 16, flex: 1 }}>
								<TextField variant='outlined' placeholder={`Encontre um ${this.props.btnTitle}`} margin="none" style={{ backgroundColor: '#fff', display: 'flex' }}
									type="search" onInput={(e) => { this.setState({ globalFilter: e.target.value }); this.doGlobalFiltering(e.target.value); }} />
							</div>
						</div>
					)}
			</div>
		);

		return (
			<div className="tableWrapper">
				<DataTable ref={(el) => this.dt = el} value={this.state.data} paginator={true} rows={this.state.rows} rowsPerPageOptions={[10, 25, 50]}
					first={this.state.first} last={this.state.last} header={header} globalFilter={this.state.globalFilter} responsive={true}
					totalRecords={this.state.totalRecords} lazy={true} onPage={this.onPage} loading={this.state.loading} loadingIcon={`fa fa-sync fa-spin`}
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} registros"
					emptyMessage="Sem pedidos.">
					<Column field="object" body={(obj) => this.bodyTableComponent(obj)} />

					{this.props.crudButtons ?
						<Column header="Opções" body={this.columnOpcoesCrud} style={{ width: '190px' }} />
						: null
					}

					{this.props.columnOpcoes ?
						<Column header="Opções" body={this.props.columnOpcoesBody} style={{ width: '190px' }} />
						: null}
				</DataTable>

				<div className="pedidoDetalhes">
					{this.state.pedidoState.pedido ?
						<>
							<h3>Pedido #{this.state.pedidoState?.pedido?.id}</h3>
							<p>Pedido realizado em: <b>{this.state.pedidoState?.pedido?.created_at_format}</b></p>
							{this.state.pedidoState?.pedido?.usuario && (
								<p>Cliente: <b>{this.state.pedidoState?.pedido?.usuario?.usr_name}</b></p>
							)}

							<div className="tableDetalhe">
								<div className={this.state.pedidoState?.pedido?.ord_state_order == 'finalizado' ? 'headerConcluido headerDetalhe' : 'headerDetalhe'}>
									<p>{this.state.pedidoState?.pedido?.ord_state_order == "aguardando" ? 'Em aberto' : 'Concluido'}</p>
								</div>

								{this.state.pedidoState?.nf.data.map((produto, index) => (
									<div key={index} className="bodyDetalhe">
										<div className="assets">
											<p>{produto.quantity}x</p>
											<h5>{produto.produto.pro_name}</h5>
										</div>

										<p className="price">{formatBRL(produto.produto?.pro_price)}</p>
									</div>
								))}

								{this.state.pedidoState?.nf?.desconto?.cou_discount ?
									<div className="footerDetalhe" style={{ height: 'auto' }}>
										<p>Cupom</p>

										<p className="price">- {formatBRL(this.state.pedidoState?.nf?.desconto?.cou_discount)}</p>
									</div>
									: null}

								<div className="footerDetalhe">
									<p>Total</p>

									<p className="price">{formatBRL(this.state.pedidoState?.nf?.total)}</p>
								</div>

								<div className="finalizarPedido">
									<p>{this.state.pedidoState?.pedido?.ord_state_payment == 'pago' ? 'Pagamento realizado.' : 'Pagamento na retirada.'}</p>

									{this.state.pedidoState?.pedido?.ord_state_order == "aguardando" ?
										<button onClick={() => this.handleFinalizarPedido({ ord_state_order: 'finalizado', ord_state_payment: 'pago', id: this.state.pedidoState?.pedido?.id })} className={`btn btn-primary btn-elevate btnPrimario`}>
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
		);
	}
}
