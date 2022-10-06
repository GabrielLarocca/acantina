import React from "react";
import Layout from "../../../../layout/Layout";
import BetterDataTable from "../../../components/BetterDataTable";
import { Column } from 'primereact/column';
import { getDataTable } from "../../../crud/usuario.crud";

export default function UsuariosIndex() {
	return (
		<Layout title={'Usuários'}>
			<BetterDataTable btnTitle="usuario" fetchEvent={getDataTable} crudButtons={true} crudUrl={"/usuarios"} idRow={`id`} deleteHandler={() => { }} noShow>
				<Column field="id" header="ID" />
				<Column field="usr_name" header="Nome" />
				<Column field="email" header="Email" />
				<Column field="created_at_format" header="Criado em" />
				<Column field="updated_at_format" header="Atualizado em" />
			</BetterDataTable>
		</Layout>
	)
};