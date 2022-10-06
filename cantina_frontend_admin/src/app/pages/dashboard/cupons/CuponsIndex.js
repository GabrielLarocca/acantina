import React from "react";
import Layout from "../../../../layout/Layout";
import BetterDataTable from "../../../components/BetterDataTable";
import { Column } from 'primereact/column';
import { getDataTable } from "../../../crud/cupom.crud";
import moment from 'moment'

export default function CuponsIndex() {
	return (
		<Layout title={'Cupons'}>
			<BetterDataTable btnTitle="cupom" fetchEvent={getDataTable} crudButtons={true} crudUrl={"/cupons"} idRow={`id`} deleteHandler={() => { }} noShow>
				<Column field="id" header="ID" />
				<Column field="cou_code" header="Código" />
				<Column field="cou_discount" header="Desconto" />
				<Column field="cou_initial_date" header="Data inicial de válidade" body={({ cou_initial_date }) => moment(cou_initial_date).format('DD/MM/YYYY hh:mm:ss')} />
				<Column field="cou_finish_date" header="Data final de válidade" body={({ cou_finish_date }) => moment(cou_finish_date).format('DD/MM/YYYY hh:mm:ss')} />
				<Column field="created_at_format" header="Criado em" />
				<Column field="updated_at_format" header="Atualizado em" />
			</BetterDataTable>
		</Layout>
	)
};