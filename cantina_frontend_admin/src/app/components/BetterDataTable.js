import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Link } from "react-router-dom";
import { Column } from 'primereact/column';
import Swal from 'sweetalert2';
import AddFillIcon from 'remixicon-react/AddFillIcon';
import EditBoxLineIcon from 'remixicon-react/EditBoxLineIcon';
import DeleteBinLineIcon from 'remixicon-react/DeleteBinLineIcon';
import { TextField } from '@material-ui/core';
import { toast } from 'react-toastify';

export default class BetterDataTable extends Component {
	constructor() {
		super();

		this.state = {
			data: [],
			rows: 10,
			totalRecords: 0,
			first: 0,
			last: 0,
			loading: false,
			globalFilter: null
		};

		this.onPage = this.onPage.bind(this);
	}

	componentDidMount() {
		this.onPage(this.state);
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
			this.setState({
				...this.state,
				data: res.data.data.data,
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

						return toast(`${this.props.btnTitle} removido com sucesso!`, { type: "success" });
					}).catch(({ response }) => {
						Swal.fire('Ops!', response?.data?.errors?.[0] ?? `Houve um problema ao remover o ${this.props.btnTitle}. Entre em contato com o suporte.`, 'error');
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
			<DataTable ref={(el) => this.dt = el} value={this.state.data} paginator={true} rows={this.state.rows} rowsPerPageOptions={[10, 25, 50]}
				first={this.state.first} last={this.state.last} header={header} globalFilter={this.state.globalFilter} responsive={true}
				totalRecords={this.state.totalRecords} lazy={true} onPage={this.onPage} loading={this.state.loading} loadingIcon={`fa fa-sync fa-spin`}
				paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
				currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} registros"
				emptyMessage="Nenhum registro encontrado!">
				{this.props.children}
				{this.props.crudButtons ?
					<Column header="Opções" body={this.columnOpcoesCrud} style={{ width: '190px' }} />
					: null
				}

				{this.props.columnOpcoes ?
					<Column header="Opções" body={this.props.columnOpcoesBody} style={{ width: '190px' }} />
					: null}
			</DataTable>
		);
	}
}
