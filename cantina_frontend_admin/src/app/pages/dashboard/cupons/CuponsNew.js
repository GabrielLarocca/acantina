import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import { create } from '../../../crud/cupom.crud';
import { FormLabel, TextField } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import { Formik } from "formik";
import Swal from "sweetalert2";
import Layout from "../../../../layout/Layout";
import Loading from "../../../components/Loading";
import { validateCupom, validateProduto } from "../../../utils/Validation";
import { formatBRLInput, limparMoeda } from "../../../utils/utils";
import { toast } from "react-toastify";
import moment from 'moment';
export default class CuponsNew extends Component {
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

		values.cou_discount = limparMoeda(values.cou_discount);

		if (values.cou_initial_date > values.cou_finish_date) {
			return Swal.fire('Ops', 'A data inicial do cupom não pode vir antes da data final.', 'error');
		}

		if (values.cou_initial_date < moment().format() || values.cou_finish_date < moment().format()) {
			return Swal.fire('Ops', 'As datas não podem vir antes de hoje.', 'error');
		}

		create(values).then(res => {
			if (res.status == 200) {
				this.setState({
					success: !Boolean(res.data.errors),
				});

				return toast('Tudo certo, o cupom foi criado.', { type: "success" });
			} else {
				return Swal.fire('Ops', res.data.errors[0] ?? 'Parece que houve um problema. Por favor, entre em contato com o suporte.', 'error');
			}
		}).catch(() => {
			return Swal.fire('Ops', 'Parece que houve um problema. Por favor, entre em contato com o suporte.', 'error');
		}).finally(() => {
			this.setState({ submitted: false });
		});
	};

	getInitialValues = () => {
		return {
			cou_description: "",
			cou_discount: "",
			cou_initial_date: "",
			cou_finish_date: ""
		};
	};

	render() {
		return (
			<Layout title="Criar novo cupom">
				<Loading loading={this.state.loading}>
					<div>
						{this.state.success ? <Navigate to={{ pathname: '/cupons' }} /> : null}

						<Formik initialValues={this.getInitialValues()} validate={values => validateCupom(values)} onSubmit={(values) => this.onSubmit(values)}>
							{({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
								<form noValidate={true} autoComplete="off" onSubmit={handleSubmit}>
									<div className="white-box">
										<div className="row">
											<div className="col-sm-4">
												<div className="form-group fg-line">
													<FormLabel>Descrição</FormLabel>

													<TextField name="cou_description" placeholder="Descrição do desconto *" variant="outlined"
														onBlur={handleBlur} onChange={handleChange} value={values.cou_description} helperText={touched.cou_description && errors.cou_description}
														error={Boolean(touched.cou_description && errors.cou_description)} />
												</div>
											</div>

											<div className="col-sm-4">
												<div className="form-group fg-line">
													<FormLabel>Valor desconto</FormLabel>

													<TextField name="cou_discount" placeholder="Valor do desconto (R$) *" variant="outlined"
														onBlur={handleBlur} onChange={e => handleChange(formatBRLInput(e))} value={values.cou_discount} helperText={touched.cou_discount && errors.cou_discount}
														error={Boolean(touched.cou_discount && errors.cou_discount)} />
												</div>
											</div>

											<div className="col-sm-4">
												<div className="form-group fg-line">
													<FormLabel>Data inicial</FormLabel>

													<TextField name="cou_initial_date" placeholder="Data inicial *" variant="outlined" type="date"
														onBlur={handleBlur} onChange={handleChange} value={values.cou_initial_date} helperText={touched.cou_initial_date && errors.cou_initial_date}
														error={Boolean(touched.cou_initial_date && errors.cou_initial_date)} InputLabelProps={{ shrink: true }} />
												</div>
											</div>

											<div className="col-sm-4">
												<div className="form-group fg-line">
													<FormLabel>Data final</FormLabel>

													<TextField name="cou_finish_date" placeholder="Data final *" variant="outlined" type="date"
														onBlur={handleBlur} onChange={handleChange} value={values.cou_finish_date} helperText={touched.cou_finish_date && errors.cou_finish_date}
														error={Boolean(touched.cou_finish_date && errors.cou_finish_date)} InputLabelProps={{ shrink: true }} />
												</div>
											</div>
										</div>
									</div>

									<div className="white-box bottom-buttons">
										<Link to={'/cupons'} className="btn btn-danger btn-bold"><i className="fa fa-arrow-left margin-icon"></i>Voltar</Link>

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