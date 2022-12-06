import React from "react";
import Layout from "../../../../layout/Layout";
import BetterDataTable from "../../../components/BetterDataTable";
import { Column } from 'primereact/column';
import { getDataTable, remove } from "../../../crud/categoria.crud";

export default function CategoriasIndex() {
	return (
		<Layout title={'Categorias'}>
			<BetterDataTable btnTitle="categoria" fetchEvent={getDataTable} crudButtons={true} crudUrl={"/categorias"} idRow={`id`} deleteHandler={remove} noShow noEdit>
				<Column field="id" header="ID" />
				<Column field="cat_name" header="Nome" />
			</BetterDataTable>
		</Layout>
	)
};