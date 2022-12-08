import React from "react";
import Layout from "../../../../layout/Layout";
import BetterDataTable from "../../../components/BetterDataTable";
import { Column } from 'primereact/column';
import { getDataTable } from "../../../crud/usuario.crud";
import moment from "moment";

export default function UsuariosIndex() {
	return (
		<Layout title={'Clientes'}>
			<BetterDataTable noHeaderNewbtn btnTitle="cliente" fetchEvent={getDataTable} crudUrl={"/cliente"} idRow={`id`}>
				<Column field="id" header="ID" />
				<Column field="usr_name" header="Nome" />
				<Column field="email" header="Email" />
				<Column field="created_at" header="Criado em" body={({ created_at }) => moment(created_at).format('DD/MM/YYYY')} />
				<Column field="usr_active" header="Status" body={({ usr_active }) => usr_active == 1 ? 'Ativo' : 'Não ativo'} />
			</BetterDataTable>
		</Layout>
	)
};