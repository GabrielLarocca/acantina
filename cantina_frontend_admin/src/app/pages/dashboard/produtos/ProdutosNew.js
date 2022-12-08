import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import { create } from '../../../crud/produto.crud';
import { FormLabel, TextField } from "@material-ui/core";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { ErrorMessage, Formik } from "formik";
import Swal from "sweetalert2";
import Layout from "../../../../layout/Layout";
import Loading from "../../../components/Loading";
import { validateProduto } from "../../../utils/Validation";
import { formatBRLInput, limparMoeda } from "../../../utils/utils";
import { Constants } from "../../../utils/Constants";
import BetterSelect from "../../../components/BetterSelect";
import { getProductCategory } from "../../../crud/categoria.crud";
import { toast } from "react-toastify";
export default class ProdutosNew extends Component {
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

	componentDidMount() {
		this.setState(({ loading: true }));

		getProductCategory().then((res) => {
			if (res.status == 200) {
				this.setState({ categorias: res.data });
			} else {
				return Swal.fire('Ops', res.data.errors[0] ?? 'Parece que houve um problema. Por favor, entre em contato com o suporte.', 'error');
			}
		}).catch(() => {
			return Swal.fire('Ops', 'Parece que houve um problema. Por favor, entre em contato com o suporte.', 'error');
		}).finally(() => {
			this.setState(({ loading: false }));
		})
	}

	onSubmit = values => {
		this.setState(({ submitted: true }));

		if (values.pro_category_id == 'none') {
			this.setState(({ submitted: false }));
			return Swal.fire('Ops', 'Você precisa escolher uma categoria para o produto.', 'error');
		}

		if (!values.photo) {
			this.setState(({ submitted: false }));
			return Swal.fire('Ops', 'Você precisa escolher uma imagem para o produto.', 'error');
		}

		values.pro_price = limparMoeda(values.pro_price);
		values.photo = values.photo.file;

		let formData = new FormData();

		for (var key in values) formData.append(key, values[key]);

		create(formData).then(res => {
			if (res.status == 200) {
				this.setState({
					success: !Boolean(res.data.errors),
				});

				return toast('Tudo certo, o produto foi criado.', { type: "success" });
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
			pro_category_id: 'none',
			photo: null
		};
	};

	render() {
		return (
			<Layout title="Criar novo produto">
				<Loading loading={this.state.loading}>
					<div>
						{this.state.success ? <Navigate to={{ pathname: '/produtos' }} /> : null}

						<Formik initialValues={this.getInitialValues()} validate={values => validateProduto(values)} onSubmit={(values) => this.onSubmit(values)}>
							{({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
								<form noValidate={true} autoComplete="off" onSubmit={handleSubmit}>
									<div className="white-box">
										<div className="row">
											<div className="col-sm-4">
												<div className="form-group fg-line">
													<FormLabel>Nome do produto</FormLabel>

													<TextField name="pro_name" placeholder="Nome do produto *" variant="outlined"
														onBlur={handleBlur} onChange={handleChange} value={values.pro_name} helperText={touched.pro_name && errors.pro_name}
														error={Boolean(touched.pro_name && errors.pro_name)} />
												</div>
											</div>

											<div className="col-sm-4">
												<div className="form-group fg-line">
													<FormLabel>Descrição do produto</FormLabel>

													<TextField name="pro_description" placeholder="Descrição do produto *" variant="outlined"
														onBlur={handleBlur} onChange={handleChange} value={values.pro_description} helperText={touched.pro_description && errors.pro_description}
														error={Boolean(touched.pro_description && errors.pro_description)} />
												</div>
											</div>

											<div className="col-sm-4">
												<div className="form-group fg-line">
													<FormLabel>Preço</FormLabel>

													<TextField name="pro_price" placeholder="Preço *" variant="outlined"
														onBlur={handleBlur} onChange={e => handleChange(formatBRLInput(e))} value={values.pro_price} helperText={touched.pro_price && errors.pro_price}
														error={Boolean(touched.pro_price && errors.pro_price)} />
												</div>
											</div>

											<div className="col-sm-4">
												<div className="form-group fg-line">
													<FormLabel>Categoria
														<OverlayTrigger trigger={['click', 'hover', 'focus']} placement="top" delay={{ show: 250, hide: 400 }}
															overlay={<Tooltip style={{ zIndex: 10000 }}>Selecione a categoria na qual o produto se encaixa. Ex: 'Coca-Cola' cabe na categoria Bebida.</Tooltip>}>
															<i className="fas fa-circle-info" style={{ marginLeft: 8 }} color="#ADB5BD" />
														</OverlayTrigger>
													</FormLabel>

													<BetterSelect name="pro_category_id" blankOption value={values.pro_category_id} onBlur={handleBlur} onChange={handleChange} placeholder="Categoria *"
														helperText={touched.pro_category_id && errors.pro_category_id} error={Boolean(touched.pro_category_id && errors.pro_category_id)}>
														{this.state.categorias.map((categoria, index) => <option key={index} value={categoria.id}>{categoria.cat_name}</option>)}
													</BetterSelect>
													{console.log(values)}
													<ErrorMessage name="pro_category_id">
														{error => <p className='MuiFormHelperText-root MuiFormHelperText-contained Mui-error'>{console.log(error)}{error}</p>}
													</ErrorMessage>
												</div>
											</div>
										</div>
									</div>

									<div className="white-box">
										<Row>
											<Col sm={6}>
												<input type="file" accept="image/*" name="photo" className="d-none" id="contained-button-file" onChange={(e) =>
													setFieldValue('photo', { url: e.currentTarget.files[0] ? URL.createObjectURL(e.currentTarget.files[0]) : null, file: e.currentTarget.files[0] })
												} />

												<label htmlFor="contained-button-file">
													<span className="btn btn-success d-flex btn-bold align-items-center"><i className={`margin-icon fa fa-camera`}></i>Selecione a imagem</span>
												</label>

												<ErrorMessage name="photo">
													{error => <p className='MuiFormHelperText-root MuiFormHelperText-contained Mui-error'>{error}</p>}
												</ErrorMessage>
											</Col>
										</Row>


										<Row className="justify-content-center">
											{values.photo != null ?
												<Col sm={4}>
													<div className='imagemUploaderMargem'>
														<a href={values.photo.url ?? ''} rel="noopener noreferrer" target="_blank">
															<div className='imagemUploaderBackground' style={{ backgroundImage: `url("${values.photo.url}")` }}></div>
														</a>

														<button type="button" className="btn btn-danger btn-bold imagemUploaderBotaoRemover" onClick={e => setFieldValue('photo', null)}>
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