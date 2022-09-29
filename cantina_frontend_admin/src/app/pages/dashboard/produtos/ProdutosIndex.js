import React, { useState } from "react";
import Layout from "../../../../layout/Layout";
import AddFillIcon from 'remixicon-react/AddFillIcon';
import { TextField } from "@material-ui/core";

export default function ProdutosIndex() {
	const [search, setSearch] = useState();

	return (
		<Layout title={'Produtos'}>
			<div className="d-flex">
				<button className={`btn btn-primary btn-elevate btnPrimario`}>
					<AddFillIcon color="#fff" size={18} style={{ marginRight: 12 }} />
					Adicionar produto
				</button>

				<div className="form-group d-flex flex-column" style={{ marginLeft: 16, flex: 1 }}>
					<TextField type="text" variant='outlined' placeholder="Encontre um produto" margin="none" style={{ backgroundColor: '#fff', display: 'flex' }}
						onChange={({ currentTarget }) => setSearch(currentTarget.value)} value={search} />
				</div>

			</div>
		</Layout>
	)
};