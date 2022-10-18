import Header from '../../components/Header'
import styles from '../../styles/Produto.module.css'
import { RiArrowLeftSLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProduto } from '../../store/ducks/produtos';
import { RiAddFill, RiSubtractFill } from 'react-icons/ri'
import { formatBRL } from '../../helpers/validation';
import { useSelector } from 'react-redux';
import { storeCarrinho } from '../../store/ducks/carrinho';
import Swal from 'sweetalert2'
import { useMediaQuery } from "react-responsive";
import { Constants } from '../../helpers/constants';

export default function Produtos() {
	const { query, back, push } = useRouter();
	const { user } = useSelector((state) => state.user);

	const isMobile = useMediaQuery({ query: "(max-width: 991px)" });

	const [produto, setProduto] = useState({});
	const [quantidade, setQuantidade] = useState(1);
	const [loading, setLoading] = useState(true);
	const [refreshCart, setRefreshCart] = useState(0);

	useEffect(() => {
		getProduto(query?.id).then((res) => {
			if (res?.status == 200) {
				if (res.data.errors) {
					return Swal.fire('Ops!', res?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
				} else {
					setProduto(res.data);
				}
			}
		}).catch(({ response }) => {
			return Swal.fire('Ops!', response?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
		}).finally(() => {
			setLoading(false);
		});
	}, []);

	const handleQuantidade = (adicionar) => {
		if (adicionar) {
			setQuantidade(e => e + 1)
		} else if (!adicionar && quantidade > 1) {
			setQuantidade(e => e - 1)
		}
	}

	const handleAddCart = () => {
		if (user) {
			storeCarrinho({ product_id: query?.id, quantity: quantidade }).then((res) => {
				if (res?.status == 200) {
					if (res.data.errors) {
						return Swal.fire('Ops!', res?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
					} else {
						setRefreshCart(prev => prev + 1);
						return Swal.fire('Ok!', 'Produto adicionado ao carrinho!', 'success');
					}
				}
			}).catch(({ response }) => {
				return Swal.fire('Ops!', response?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
			});
		} else {
			push(`/auth`);
		}
	}

	const ReturnButton = () => (
		<div onClick={back} className={styles.voltarBtn}>
			<RiArrowLeftSLine color='#FFF' size={20} />
			<p>Voltar</p>
		</div>
	)

	const Incrementar = () => (
		<div className={styles.containerFooter}>
			<div className={styles.incrementar}>
				<RiSubtractFill onClick={() => handleQuantidade(false)} />

				<p>{quantidade}</p>

				<RiAddFill onClick={() => handleQuantidade(true)} />
			</div>

			<p className={styles.precoTotalFooter}>{formatBRL(produto?.pro_price * quantidade)}</p>
		</div>
	)

	return (
		<div className={styles.containerGeral}>
			<Header refreshCart={refreshCart} />

			{produto ? (
				<div className={styles.containerDesk}>
					<ReturnButton />

					<div className={styles.imagemProduto} style={produto?.pro_image_path ? { backgroundImage: `url(${Constants.imageUrl + produto?.pro_image_path})` } : {}} />

					<div className={styles.container}>
						<div>
							<h1 className={styles.titulo}>{produto?.pro_name}</h1>
							<p className={styles.descricaoProduto}>{produto?.pro_description}</p>
							<p className={styles.precoProduto}>{formatBRL(produto?.pro_price)}</p>
						</div>

						{!isMobile && (
							<div>
								<Incrementar />

								<button className={styles.btnFooter} onClick={handleAddCart}>
									Adicionar ao carrinho
								</button>
							</div>
						)}
					</div>

					{isMobile && (
						<footer className={styles.footer}>
							<Incrementar />

							<button className={styles.btnFooter} onClick={handleAddCart}>
								Adicionar ao carrinho
							</button>
						</footer>
					)}
				</div>
			) : <></>}
		</div>
	)
}
