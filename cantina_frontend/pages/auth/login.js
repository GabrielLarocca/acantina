import Header from '../../components/Header'
import { RiArrowLeftSLine } from 'react-icons/ri';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from "react-redux";
import { Spinner } from 'react-bootstrap';
import { Formik } from "formik";
import { TextField } from "@material-ui/core";
import Swal from 'sweetalert2'
import { validateLogin } from '../../helpers/validation';
import { login, userLogged } from '../../store/ducks/user';
import styles from '../../styles/Auth.module.css'

export default function Login() {
	const router = useRouter();
	const dispatch = useDispatch();

	const onSubmit = (values, setSubmitting) => {
		setSubmitting(true);

		login(values).catch(({ response }) => {
			return Swal.fire('Ops!', response?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
		}).then(res => {
			if (res?.status == 200) {
				if (res.data.errors) {
					return Swal.fire('Ops!', res?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
				} else if (res?.data?.token) {
					localStorage.setItem('token', res.data.token);
					res.data.isLogged == true;

					dispatch(userLogged(res.data));

					router.push('/');
				}
			}
		}).finally(() => {
			setSubmitting(false);
		});
	}

	return (
		<>
			<Header />

			<div className={styles.containerDesk}>
				<div className={styles.container}>
					<Formik initialValues={{ email: "", password: "" }} validate={values => validateLogin(values)} onSubmit={(values, { setSubmitting }) => onSubmit(values, setSubmitting)}>
						{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
							<form noValidate={true} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', height: '100%' }} onSubmit={handleSubmit}>
								<div style={{ flexGrow: 1 }}>
									<Link href={'/auth'}>
										<div className={styles.voltarBtn}>
											<RiArrowLeftSLine color='#384047' size={20} />
											<p>Voltar</p>
										</div>
									</Link>

									<h1 className={styles.title}>Fazer o login</h1>

									<div className="form-group">
										<p>E-mail</p>
										<TextField type="email" variant='outlined' placeholder="E-mail" margin="none" name="email"
											onBlur={handleBlur} onChange={handleChange} value={values.email} helperText={touched.email && errors.email}
											error={Boolean(touched.email && errors.email)} />
									</div>

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
										Entrar

										{isSubmitting && (
											<Spinner color="#FFF" size="sm" animation="border" className={"spinner ml-3"} />
										)}
									</button>
								</div>
							</form>
						)}
					</Formik>
				</div>
			</div>

		</>
	)
}
