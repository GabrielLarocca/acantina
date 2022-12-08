import Header from '../../components/Header'
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import styles from '../../styles/Pagamento.module.css'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { getCarrinho } from '../../store/ducks/carrinho';
import { formatBRL, validateCartao } from '../../helpers/validation';
import { Formik } from 'formik';
import { TextField } from "@material-ui/core";
import { Spinner } from 'react-bootstrap';
import { checkCupomExist, storePedido } from '../../store/ducks/pedido';

export default function Pagamento() {
	const [carrinho, setCarrinho] = useState([]);
	const [total, setTotal] = useState(0);
	const [step, setStep] = useState(0);
	const [refreshCart, setRefreshCart] = useState(0);
	const [pedidoId, setPedidoId] = useState(0);
	const [desconto, setDesconto] = useState({});
	const [loading, setLoading] = useState(true);

	const router = useRouter();

	const { user } = useSelector((state) => state.user);

	useEffect(() => {
		listCart();
	}, []);

	const onSubmitDesconto = (values, setSubmitting) => {
		setSubmitting(true);

		checkCupomExist(values).then((res) => {
			if (res?.status == 200) {
				if (res.data.errors) {
					return Swal.fire('Ops!', res?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
				} else {
					setDesconto(res.data);
				}
			}
		}).catch(({ response }) => {
			return Swal.fire('Ops!', response?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
		}).finally(() => {
			setSubmitting(false);
		})
	}

	const onSubmit = () => {
		setLoading(true);

		storePedido({ ord_type_payment: 'credit-card' }).then((res) => {
			if (res?.status == 200) {
				if (res.data.errors) {
					return Swal.fire('Ops!', res?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
				} else {
					location.replace(res.data.stripe.checkout.url);
				}
			}
		}).catch(({ response }) => {
			return Swal.fire('Ops!', response?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
		}).finally(() => {
			setLoading(false);
		});
	}

	const onSubmitRetirada = () => {
		storePedido({ ord_type_payment: 'retirada', cupom: desconto?.cou_code }).then((res) => {
			if (res?.status == 200) {
				if (res.data.errors) {
					return Swal.fire('Ops!', res?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
				} else {
					setRefreshCart(prev => prev + 1);
					setStep(3);
					setPedidoId(res.data.id);
				}
			}
		}).catch(({ response }) => {
			return Swal.fire('Ops!', response?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
		});
	}

	const handleStep = () => {
		setStep(step + 1);
	}

	const handleBack = () => {
		switch (step) {
			case 0:
				router.push('/')

				break;

			case 1:
				setStep(0);

				break;

			case 2:
				setStep(1);

				break;

			case 3:
				router.push('/')

				break;

			default:
				break;
		}
	}

	const listCart = () => {
		getCarrinho(user?.id).then((res) => {
			if (res?.status == 200) {
				if (res.data.errors) {
					return Swal.fire('Ops!', res?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
				} else {
					setCarrinho(res.data.data);
					setTotal(res.data.total);
				}
			}
		}).catch(({ response }) => {
			return Swal.fire('Ops!', response?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
		});
	}

	function Botao(props) {
		return (
			<div onClick={props.retirada ? onSubmitRetirada : onSubmit} className={styles.buttonInicial}>
				<p>{props.title}</p>
				<RiArrowRightSLine color='#787A7C' size={20} />
			</div>
		)
	}

	const Step1 = () => (
		<>
			{carrinho.map((produto, index) => (
				<div key={index} className={styles.flexItem}>
					<p>{produto?.quantity}x</p>

					<p>{produto?.produto?.pro_name}</p>

					<p>{formatBRL(produto?.totalPrice)}</p>
				</div>
			))}

			<hr className={styles.line} />

			<Formik initialValues={{ cupom: "" }} onSubmit={(values, { setSubmitting }) => onSubmitDesconto(values, setSubmitting)}>
				{({ values, handleChange, handleSubmit, isSubmitting, setFieldValue }) => (
					<form noValidate={true} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', height: '100%' }} onSubmit={handleSubmit}>
						<div className={styles.descontoContainer}>
							<p>Desconto</p>

							{desconto?.cou_discount ?
								<p>-{formatBRL(desconto?.cou_discount)}</p>
								:
								<div className='d-flex'>
									<div style={{ width: 160, marginRight: 12 }}>
										<TextField variant='outlined' placeholder="Digite o códido" name="cupom" margin="none" onChange={(e) => setFieldValue('cupom', e.target.value.toUpperCase())} value={values.cupom} />
									</div>

									<button type="submit" disabled={isSubmitting} className={styles.buttonP} style={{ width: 100, height: 47 }}>
										Procurar

										{isSubmitting && (
											<Spinner color="#FFF" size="sm" animation="border" className={"spinner ml-3"} />
										)}
									</button>
								</div>
							}
						</div>
					</form>
				)}
			</Formik>

			<hr className={styles.line} />

			<div className={styles.totalContainer}>
				<p>Total</p>

				<p>{formatBRL(total - (desconto?.cou_discount || 0))}</p>
			</div>

			<button className={styles.buttonP} onClick={handleStep}>Continuar</button>
		</>
	)

	const Step2 = () => (
		<>
			<p>Selecione a opção de pagamento</p>

			<Botao title='Pagar na retirada' retirada />
			<Botao title='Pagar com cartão de crédito' />
		</>
	)

	const Step3 = () => (
		<>
			{carrinho.map((produto, index) => (
				<div key={index} className={styles.flexItem}>
					<p>{produto?.quantity}x</p>

					<p>{produto?.produto?.pro_name}</p>

					<p>{formatBRL(produto?.totalPrice)}</p>
				</div>
			))}

			<hr className={styles.line} />

			<div className={styles.descontoContainer}>
				<p>Desconto</p>

				<p>-{formatBRL(12.90)}</p>
			</div>

			<hr className={styles.line} />

			<div className={styles.totalContainer}>
				<p>Total</p>

				<p>{formatBRL(total)}</p>
			</div>

			<div className={styles.containerPagamento}>
				<h3>Informe os dados do cartão</h3>

				<Formik initialValues={{ nome_cartao: "", numero_cartao: "", vencimento: "", cvv: "" }} validate={values => validateCartao(values)} onSubmit={(values, { setSubmitting }) => onSubmit(values, setSubmitting)}>
					{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
						<form noValidate={true} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', height: '100%' }} onSubmit={handleSubmit}>
							<div style={{ flexGrow: 1 }}>
								<div className="form-group">
									<p>Nome escrito no cartão</p>
									<TextField variant='outlined' placeholder="Nome no cartão" margin="none" name="nome_cartao"
										onBlur={handleBlur} onChange={handleChange} value={values.nome_cartao} helperText={touched.nome_cartao && errors.nome_cartao}
										error={Boolean(touched.nome_cartao && errors.nome_cartao)} />
								</div>

								<div className="form-group">
									<p>Número do cartão</p>
									<TextField variant='outlined' placeholder="Número do cartão" margin="none" name="numero_cartao"
										onBlur={handleBlur} onChange={handleChange} value={values.numero_cartao} helperText={touched.numero_cartao && errors.numero_cartao}
										error={Boolean(touched.numero_cartao && errors.numero_cartao)} />
								</div>

								<div className='d-flex'>
									<div className="form-group" style={{ marginRight: 8, flex: 1 }}>
										<p>Vencimento</p>
										<TextField variant='outlined' placeholder="Vencimento" margin="none" name="vencimento"
											onBlur={handleBlur} onChange={handleChange} value={values.vencimento} helperText={touched.vencimento && errors.vencimento}
											error={Boolean(touched.vencimento && errors.vencimento)} />
									</div>

									<div className="form-group" style={{ marginLeft: 8, flex: 1 }}>
										<p>CVV</p>
										<TextField variant='outlined' placeholder="CVV" margin="none" name="cvv"
											onBlur={handleBlur} onChange={handleChange} value={values.cvv} helperText={touched.cvv && errors.cvv}
											error={Boolean(touched.cvv && errors.cvv)} />
									</div>
								</div>
							</div>

							<div>
								<button type="submit" disabled={isSubmitting} className={styles.buttonP} style={{ marginTop: 58, marginBottom: 20 }}>
									Realizar o pagamento

									{isSubmitting && (
										<Spinner color="#FFF" size="sm" animation="border" className={"spinner ml-3"} />
									)}
								</button>
							</div>
						</form>
					)}
				</Formik>
			</div>
		</>
	)

	const Step4 = () => (
		<div className={styles.pedidoDone}>
			<img src="/images/CheckPedido.png" width={124} height={104} />
			<h3>Pedido nº{pedidoId ?? 0} </h3>
			<p>Seu pedido foi realizado com sucesso! Agora é só aguardar, seu pedido está sendo preparado e você será aviso para fazer a retirada no balcão.</p>
		</div>
	)

	return (
		<div className='pb-4'>
			<Header refreshCart={refreshCart} />

			<div className={styles.container}>
				<div onClick={handleBack} className={styles.voltarBtn}>
					<RiArrowLeftSLine color='#384047' size={20} />
					<p>Voltar</p>
				</div>

				{step != 3 && (
					<h1 className={styles.title}>Pagamento</h1>
				)}

				{step == 0 && (
					<Step1 />
				)}

				{step == 1 && (
					<Step2 />
				)}

				{step == 2 && (
					<Step3 />
				)}

				{step == 3 && (
					<Step4 />
				)}
			</div>
		</div>
	)
}
