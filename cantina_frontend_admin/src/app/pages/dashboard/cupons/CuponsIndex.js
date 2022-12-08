import React from "react";
import Layout from "../../../../layout/Layout";
import BetterDataTable from "../../../components/BetterDataTable";
import { Column } from 'primereact/column';
import { getDataTable } from "../../../crud/cupom.crud";
import moment from 'moment'
import { formatBRL } from "../../../utils/Validation";

export default function CuponsIndex() {
	return (
		<Layout title={'Cupons'}>
			<BetterDataTable btnTitle="cupom" fetchEvent={getDataTable} crudButtons={true} crudUrl={"/cupons"} idRow={`id`} deleteHandler={() => { }} noShow noEdit>
				<Column field="id" header="ID" />
				<Column field="cou_code" header="Código" />
				<Column field="cou_discount" header="Desconto" body={({ cou_discount }) => formatBRL(cou_discount)} />
				<Column field="cou_initial_date" header="Data inicial de validade" body={({ cou_initial_date }) => moment(cou_initial_date).format('DD/MM/YYYY hh:mm:ss')} />
				<Column field="cou_finish_date" header="Data final de validade" body={({ cou_finish_date }) => moment(cou_finish_date).format('DD/MM/YYYY hh:mm:ss')} />
				<Column field="active" header="Status" body={({ active }) => active == 1 ? 'Ativo' : 'Não ativo'} />
			</BetterDataTable>
		</Layout>
	)
};