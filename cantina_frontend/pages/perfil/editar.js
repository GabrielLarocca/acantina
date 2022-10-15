import Header from '../../components/Header'
import { RiArrowLeftSLine } from 'react-icons/ri';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from 'react-bootstrap';
import { Formik } from "formik";
import { TextField } from "@material-ui/core";
import Swal from 'sweetalert2'
import { validateEditPerfil, validateRegister } from '../../helpers/validation';
import styles from '../../styles/ProfileEdit.module.css'
import { edit, getMe, updateUser } from '../../store/ducks/user';
import { useEffect, useState } from 'react';

export default function Editar() {
	const router = useRouter();
	const dispatch = useDispatch();
	const [usuario, setUsuario] = useState();
	const userRedux = useSelector((state) => state.user);


	useEffect(() => {
		getMe().catch(({ response }) => {
			return Swal.fire('Ops!', response?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
		}).then(res => {
			if (res?.status == 200) {
				if (res.data.errors) {
					return Swal.fire('Ops!', res?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
				} else {
					setUsuario(res.data);
				}
			}
		});
	}, [])

	const onSubmit = (values, setSubmitting) => {
		setSubmitting(true);

		edit(values).catch(({ response }) => {
			return Swal.fire('Ops!', response?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
		}).then(res => {
			if (res?.status == 200) {
				if (res.data.errors) {
					return Swal.fire('Ops!', res?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
				} else {
					let userLet = userRedux;
					userLet.user = res.data;

					dispatch(updateUser(userLet));
				}
			}
		}).finally(() => {
			setSubmitting(false);
		});
	}

	return (
		<div style={{ paddingBottom: 24 }}>
			<Header />

			<div className={styles.containerDesk}>
				<div className={styles.container}>
					{usuario && (
						<Formik initialValues={{ usr_name: usuario?.usr_name, email: usuario?.email, password: "" }} validate={values => validateEditPerfil(values)} onSubmit={(values, { setSubmitting }) => onSubmit(values, setSubmitting)}>
							{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
								<form noValidate={true} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', height: '100%' }} onSubmit={handleSubmit}>
									<div style={{ flexGrow: 1 }}>
										<Link href={'/perfil'}>
											<div className={styles.voltarBtn}>
												<RiArrowLeftSLine color='#384047' size={20} />
												<p>Voltar</p>
											</div>
										</Link>

										<h1 className={styles.title}>Editar perfil</h1>

										<div className="form-group">
											<p>Nome completo</p>
											<TextField variant='outlined' placeholder="Nome" margin="none" name="usr_name"
												onBlur={handleBlur} onChange={handleChange} value={values.usr_name} helperText={touched.usr_name && errors.usr_name}
												error={Boolean(touched.usr_name && errors.usr_name)} />
										</div>

										{/* <div className="form-group">
										<p>CPF</p>
										<TextField variant='outlined' placeholder="CPF" margin="none" name="email"
											onBlur={handleBlur} onChange={handleChange} value={values.email} helperText={touched.email && errors.email}
											error={Boolean(touched.email && errors.email)} />
									</div> */}

										<div className="form-group">
											<p>E-mail</p>
											<TextField type="email" variant='outlined' placeholder="E-mail" margin="none" name="email"
												onBlur={handleBlur} onChange={handleChange} value={values.email} helperText={touched.email && errors.email}
												error={Boolean(touched.email && errors.email)} />
										</div>

										<p className={styles.alterarSenha}>Para alterar, informe uma nova senha e salve.</p>

										<div className="form-group">
											<p>Senha</p>
											<TextField type="password" variant='outlined' placeholder="Senha" margin="none" name="password"
												onBlur={handleBlur} onChange={handleChange} value={values.password} helperText={touched.password && errors.password}
												error={Boolean(touched.password && errors.password)} />
										</div>

										{/* <p className={styles.esqueciSenha}>Esqueceu a senha?</p> */}
									</div>

									<div>
										<button type="submit" style={{ marginTop: 36 }} disabled={isSubmitting} className={styles.buttonP}>
											Salvar

											{isSubmitting && (
												<Spinner color="#FFF" size="sm" animation="border" className={"spinner pl-3"} />
											)}
										</button>
									</div>
								</form>
							)}
						</Formik>
					)}
				</div>
			</div>

		</div>
	)
}
