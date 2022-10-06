import React from "react";
import Layout from "../../../../layout/Layout";
import BetterDataTable from "../../../components/BetterDataTable";
import { getDataTable } from "../../../crud/pedido.crud";
import { Column } from 'primereact/column';

export default function PedidosIndex() {
	return (
		<Layout title={'Pedidos'}>
			<BetterDataTable btnTitle="pedido" fetchEvent={getDataTable} crudButtons={true} crudUrl={"/pedidos"} idRow={`id`} deleteHandler={() => { }} noShow>
				<Column field="id" header="ID" />
				<Column field="pro_name" header="Nome" />
				<Column field="pro_description" header="Descrição" />
				<Column field="created_at_format" header="Criado em" />
				<Column field="updated_at_format" header="Atualizado em" />
			</BetterDataTable>
		</Layout>
	)
};