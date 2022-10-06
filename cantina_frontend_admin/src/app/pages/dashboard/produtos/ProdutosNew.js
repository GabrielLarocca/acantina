import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import { create } from '../../../crud/produto.crud';
import { TextField } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import { Formik } from "formik";
import Swal from "sweetalert2";
import Layout from "../../../../layout/Layout";
import Loading from "../../../components/Loading";
import { validateProduto } from "../../../utils/Validation";
import { formatBRLInput, limparMoeda } from "../../../utils/utils";

export default class ProdutosNew extends Component {
	constructor() {
		super();

		this.state = {
			loading: false,
			submitted: false,
			success: false,
			errors: [],
		};
	}

	onSubmit = values => {
		this.setState(({ submitted: true }));

		values.pro_price = limparMoeda(values.pro_price);

		create(values).then(res => {
			if (res.status == 200) {
				this.setState({
					success: !Boolean(res.data.errors),
				});

				return Swal.fire('Ok', 'Tudo certo, o produto foi criado.', 'success');
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
			pro_name: "",
			pro_description: "",
			pro_price: "",
			pro_category_id: "",
			pro_image: ""
		};
	};

	render() {
		return (
			<Layout title="Criar novo produto">
				<Loading loading={this.state.loading}>
					<div>
						{this.state.success ?
							<Navigate to={{ pathname: '/produtos' }} />
							: null
						}

						<Formik initialValues={this.getInitialValues()} validate={values => validateProduto(values)} onSubmit={(values) => this.onSubmit(values)}>
							{({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
								<form noValidate={true} autoComplete="off" onSubmit={handleSubmit}>
									<div className="white-box">
										<div className="row">
											<div className="col-sm-4">
												<div className="form-group fg-line">
													<TextField name="pro_name" placeholder="Nome do produto *" margin="normal" variant="outlined"
														onBlur={handleBlur} onChange={handleChange} value={values.pro_name} helperText={touched.pro_name && errors.pro_name}
														error={Boolean(touched.pro_name && errors.pro_name)} />
												</div>
											</div>

											<div className="col-sm-4">
												<div className="form-group fg-line">
													<TextField name="pro_description" placeholder="Descrição do produto *" margin="normal" variant="outlined"
														onBlur={handleBlur} onChange={handleChange} value={values.pro_description} helperText={touched.pro_description && errors.pro_description}
														error={Boolean(touched.pro_description && errors.pro_description)} />
												</div>
											</div>

											<div className="col-sm-4">
												<div className="form-group fg-line">
													<TextField name="pro_price" placeholder="Preço *" margin="normal" variant="outlined"
														onBlur={handleBlur} onChange={e => handleChange(formatBRLInput(e))} value={values.pro_price} helperText={touched.pro_price && errors.pro_price}
														error={Boolean(touched.pro_price && errors.pro_price)} />
												</div>
											</div>

											<div className="col-sm-4">
												<div className="form-group fg-line">
													<TextField name="pro_category_id" placeholder="Categoria *" margin="normal" variant="outlined"
														onBlur={handleBlur} onChange={handleChange} value={values.pro_category_id} helperText={touched.pro_category_id && errors.pro_category_id}
														error={Boolean(touched.pro_category_id && errors.pro_category_id)} />
												</div>
											</div>
										</div>

										<Row>
											<Col sm={6} className="mb-4">
												<input type="file" accept="image/*" name="pro_image" className="d-none" id="contained-button-file" onChange={(e) =>
													setFieldValue('pro_image', { url: e.currentTarget.files[0] ? URL.createObjectURL(e.currentTarget.files[0]) : null, file: e.currentTarget.files[0] })
												} />

												<label htmlFor="contained-button-file">
													<span className="btn btn-success d-flex btn-bold"><i className={`margin-icon fa fa-camera`}></i>Selecione a imagem</span>
												</label>
											</Col>
										</Row>

										<Row className="justify-content-center">
											{values.pro_image?.url != null ?
												<Col sm={4}>
													<div className='imagemUploaderMargem'>
														<a href={values.pro_image?.url ?? ''} rel="noopener noreferrer" target="_blank">
															<div className='imagemUploaderBackground' style={{ backgroundImage: `url("${values.pro_image?.url}")` }}></div>
														</a>

														<button type="button" className="btn btn-danger btn-bold imagemUploaderBotaoRemover" onClick={e => setFieldValue('pro_image', null)}>
															<i className="fas fa-times margin-icon" aria-hidden="true"></i>Remover
														</button>
													</div>
												</Col>
												:
												null
											}
										</Row>
									</div>

									<div className="white-box bottom-buttons">
										<Link to={'/produtos'} className="btn btn-danger btn-bold"><i className="fa fa-arrow-left margin-icon"></i>Voltar</Link>

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