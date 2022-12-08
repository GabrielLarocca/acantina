import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import { create } from '../../../crud/categoria.crud';
import { FormLabel, TextField } from "@material-ui/core";
import { Formik } from "formik";
import Swal from "sweetalert2";
import Layout from "../../../../layout/Layout";
import Loading from "../../../components/Loading";
import { validateCategoria } from "../../../utils/Validation";
import { ToastContainer, toast } from 'react-toastify';

export default class CategoriasNew extends Component {
	constructor() {
		super();

		this.state = {
			loading: false,
			submitted: false,
			success: false,
			errors: [],
			categorias: []
		};
	}

	onSubmit = values => {
		this.setState(({ submitted: true }));

		create(values).then(res => {
			if (res.status == 200 && !res.data.errors) {
				this.setState({
					success: !Boolean(res.data.errors),
				});

				return toast('Tudo certo, a categoria foi criada.', { type: "success" });
			} else {
				if (res.data.errors[0] == 'The cat name has already been taken.') {
					return Swal.fire('Ops', 'Essa categoria já existe.', 'error');
				} else {
					return Swal.fire('Ops', res.data.errors[0] ?? 'Parece que houve um problema. Por favor, entre em contato com o suporte.', 'error');
				}
			}
		}).catch(() => {
			return Swal.fire('Ops', 'Parece que houve um problema. Por favor, entre em contato com o suporte.', 'error');
		}).finally(() => {
			this.setState({ submitted: false });
		});
	};

	getInitialValues = () => {
		return {
			cat_name: "",
		};
	};

	render() {
		return (
			<Layout title="Criar nova categoria">
				<Loading loading={this.state.loading}>
					<div>
						{this.state.success ? <Navigate to={{ pathname: '/categorias' }} /> : null}

						<Formik initialValues={this.getInitialValues()} validate={values => validateCategoria(values)} onSubmit={(values) => this.onSubmit(values)}>
							{({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
								<form noValidate={true} autoComplete="off" onSubmit={handleSubmit}>
									<div className="white-box">
										<div className="row">
											<div className="col-sm-4">
												<div className="form-group fg-line">
													<FormLabel>Nome da categoria</FormLabel>

													<TextField name="cat_name" placeholder="Nome da categoria *" variant="outlined"
														onBlur={handleBlur} onChange={handleChange} value={values.cat_name} helperText={touched.cat_name && errors.cat_name}
														error={Boolean(touched.cat_name && errors.cat_name)} />
												</div>
											</div>
										</div>
									</div>

									<div className="white-box bottom-buttons">
										<Link to={'/categorias'} className="btn btn-danger btn-bold"><i className="fa fa-arrow-left margin-icon"></i>Voltar</Link>

										<button type="submit" disabled={this.state.submitted} className="btn btn-success btn-bold pull-right">
											<i className={`margin-icon ${this.state.submitted ? "fas fa-sync fa-spin" : "fa fa-check-square"}`}></i>Enviar
										</button>
									</div>
								</form>
							)}
						</Formik>
					</div>
				</Loading>
			</Layout>
		);
	}
}