import React from "react";
import Layout from "../../../../layout/Layout";
import BetterDataTable from "../../../components/BetterDataTable";
import { Column } from 'primereact/column';
import { getDataTable, remove } from "../../../crud/produto.crud";
import { formatBRL } from "../../../utils/Validation";

export default function ProdutosIndex() {
	return (
		<Layout title={'Produtos'}>
			<BetterDataTable btnTitle="produto" fetchEvent={getDataTable} crudButtons={true} crudUrl={"/produtos"} idRow={`id`} deleteHandler={remove} noShow>
				<Column field="id" header="ID" />
				<Column field="pro_name" header="Nome" />
				<Column field="pro_description" header="Descrição" />
				<Column field="pro_price" header="Preço" body={({ pro_price }) => formatBRL(pro_price)} />
				<Column field="categoria.cat_name" header="Categoria" />
			</BetterDataTable>
		</Layout>
	)
};