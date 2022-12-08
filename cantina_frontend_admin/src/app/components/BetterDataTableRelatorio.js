import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { TextField } from '@material-ui/core';

export default class BetterDataTableRelatorio extends Component {
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

	render() {
		const header = (
			<div className="d-flex">
				<div className="form-group d-flex flex-column" style={{ flex: 1 }}>
					<TextField variant='outlined' placeholder={`Encontre uma venda`} margin="none" style={{ backgroundColor: '#fff', display: 'flex' }}
						type="search" onInput={(e) => { this.setState({ globalFilter: e.target.value }); this.doGlobalFiltering(e.target.value); }} />
				</div>
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
			</DataTable>
		);
	}
}
