import React from "react";
import { Col, Row } from "react-bootstrap";
import { validateLogin } from "../../utils/Validation";
import { Formik } from "formik";
import { TextField } from "@material-ui/core";
import { Spinner } from "react-bootstrap";
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { connect } from "react-redux";
import { login } from "../../crud/auth.crud";
import * as utils from "../../utils/utils";
import * as auth from "../../store/ducks/auth.duck";

function AuthPage(props) {
	const [parent] = useAutoAnimate()

	const onSubmit = (values, setStatus, setSubmitting) => {
		setSubmitting(true);

		login(values.email, values.password).then(res => {
			if (res.status) {
				utils.setStorage('authToken', res.data.token, null);
				props.login(res.data);
				window.location.href = "/dashboard";
			}
		}).catch(() => {
			setStatus("Usuário ou senha incorretos.");
		}).finally(() => {
			setSubmitting(false);
		});
	}

	return (
		<Row id="authPage" className="m-0 p-0">
			<Col lg={4} md={6} className="p-0 m-0">
				<div className="loginForm">
					<Formik initialValues={{ email: "", password: "" }} validate={values => validateLogin(values)} onSubmit={(values, { setStatus, setSubmitting }) => onSubmit(values, setStatus, setSubmitting)}>
						{({ values, status, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
							<form noValidate={true} autoComplete="off" className="kt-form" onSubmit={handleSubmit} ref={parent}>
								<div className="d-flex justify-content-center">
									<div className="logo" style={{ backgroundImage: 'url(images/ACantina_logoDark.svg)' }} />
								</div>

								{status ? (
									<div role="alert" className="alert alert-danger">
										<div className="alert-text">{status}</div>
									</div>
								) : null}

								<div className="form-group">
									<TextField type="email" variant='outlined' placeholder="E-mail" margin="normal" name="email"
										onBlur={handleBlur} onChange={handleChange} value={values.email} helperText={touched.email && errors.email}
										error={Boolean(touched.email && errors.email)} />
								</div>

								<div className="form-group">
									<TextField type="password" variant='outlined' placeholder="Senha" margin="normal" name="password"
										onBlur={handleBlur} onChange={handleChange} value={values.password} helperText={touched.password && errors.password}
										error={Boolean(touched.password && errors.password)} />
								</div>

								<div>
									<button ref={parent} type="submit" disabled={isSubmitting} className={`btn btn-primary btn-elevate btnPrimario w-100`}>
										Entrar

										{isSubmitting && (
											<Spinner color="#FFF" size="sm" animation="border" className={"spinner"} />
										)}
									</button>
								</div>
							</form>
						)}
					</Formik>
				</div>
			</Col>

			<Col lg={8} md={6} className="p-0 m-0">
				<div style={{ backgroundImage: 'url(images/backgroundAuth.png)' }} className="background">
					<div className="">&copy; 2022 A cantina</div>
					{console.log(process.env)}
				</div>
			</Col>
		</Row>
	);
}

export default connect(null, auth.actions)(AuthPage)