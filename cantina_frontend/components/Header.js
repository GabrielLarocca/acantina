import Head from 'next/head'
import { useSelector } from "react-redux";
import { RiShoppingCart2Fill, RiMenuFill, RiCloseFill } from 'react-icons/ri';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { deleteItemCarrinho, getCarrinho } from '../store/ducks/carrinho';
import { slide as Menu } from 'react-burger-menu'
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2'
import { formatBRL } from '../helpers/validation';

import styles from '../styles/Header.module.css'
import { setLogout } from '../store/ducks/user';
import { useMediaQuery } from 'react-responsive';
import Link from 'next/link';
import { Constants } from '../helpers/constants';

export default function Header(props) {
	const [modalCarrinho, setModalCarrinho] = useState(false);
	const [menu, setMenu] = useState(false);
	const [carrinho, setCarrinho] = useState([]);
	const [loading, setLoading] = useState(true);
	const [total, setTotal] = useState(0);

	const router = useRouter();
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.user);
	const isMobile = useMediaQuery({ query: "(max-width: 991px)" });

	useEffect(() => {
		if (user) {
			listCart();
		}
	}, [props.refreshCart]);

	const listCart = () => {
		getCarrinho().then((res) => {
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

	const handleDeleteItem = (itemId) => {
		deleteItemCarrinho(itemId).then((res) => {
			if (res?.status == 200) {
				if (res.data.errors) {
					return Swal.fire('Ops!', res?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
				} else {
					listCart();
				}
			}
		}).catch(({ response }) => {
			return Swal.fire('Ops!', response?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
		}).finally(() => {
			setLoading(false);
		});
	}

	const logout = () => {
		dispatch(setLogout());

		router.reload();
	}

	const ProdutoCard = ({ produto }) => (
		<div className={styles.cardCarrinho}>
			<div className={styles.imagemCarrinho} style={produto?.produto?.pro_image_path ? { backgroundImage: `url(${Constants.imageUrl + produto?.produto?.pro_image_path})` } : {}} />
			{console.log(produto)}
			<div className={styles.infoCarrinho}>
				<p className={styles.nomeCarrinho}>{produto.produto?.pro_name}</p>
				<p className={styles.quantidadeCarrinho}>{produto.quantity}  {produto.quantity > 1 ? 'unidades' : 'unidade'}</p>
				<p className={styles.precoCarrinho}>{formatBRL(produto.produto?.pro_price)}</p>
			</div>

			<div onClick={() => handleDeleteItem(produto?.product_id)}>
				<RiCloseFill size={20} color={'#787A7C'} />
			</div>
		</div>
	)

	const MenuLateral = () => (
		<Menu isOpen={menu} onClose={() => setMenu(false)}>
			<Link href={'/'}>
				<div className={router.route == '/' ? styles.selectedItemLateral : styles.itemLateral}>
					Início
				</div>
			</Link>

			{user ? (
				<>
					<Link href={'/pedidos'}>
						<div className={router.route.includes('pedidos') ? styles.selectedItemLateral : styles.itemLateral}>
							Seus Pedidos
						</div>
					</Link>

					<Link href={'/perfil'}>
						<div className={router.route.includes('perfil') ? styles.selectedItemLateral : styles.itemLateral}>
							Perfil
						</div>
					</Link>

					<div className={styles.itemLateral} onClick={logout}>
						Sair
					</div>
				</>
			) : (
				<>
					<Link href={'/auth'}>
						<div className={router.route.includes('auth') ? styles.selectedItemLateral : styles.itemLateral}>
							Login
						</div>
					</Link>
				</>
			)}
		</Menu>
	)

	const openCart = () => {
		if (user) {
			setModalCarrinho(true);
			listCart();
		} else {
			router.push(`/auth`);
		}
	}

	const handleFinalizarPedido = () => {
		router.push(`/pagamento`);
	}

	return (
		<>
			<Head>
				<title>A cantina - Loja</title>
			</Head>

			<MenuLateral />

			<header id="header" className={styles.header}>
				{!isMobile ?
					<div className={styles.itemsHeader}>
						<Link href={'/'}>
							<p className={router.route == '/' ? styles.selectedHeader : {}}>
								Início
							</p>
						</Link>

						<Link href={user ? '/pedidos' : '/auth'}>
							<p className={router.route.includes('pedidos') ? styles.selectedHeader : {}}>
								Seus pedidos
							</p>
						</Link>

						<Link href={user ? '/perfil' : '/auth'}>
							<p className={router.route.includes('perfil') ? styles.selectedHeader : {}}>
								Perfil
							</p>
						</Link>
					</div>
					:
					menu ?
						<RiCloseFill color="#FFF" size={20} onClick={() => setMenu(!menu)} />
						:
						<RiMenuFill color="#FFF" size={20} onClick={() => setMenu(!menu)} />
				}

				<Link href={'/'}>
					<Image className='pointer' width={90} height={30} src="/images/ACantina_logoWhite.svg" alt='logo da loja' />
				</Link>

				<div onClick={openCart} className={styles.containerItemOnCart}>
					<RiShoppingCart2Fill color='#FFF' size={20} />

					{carrinho.length > 0 && (
						<div>
							<p>{carrinho.length}</p>
						</div>
					)}

				</div>
			</header>

			<Modal dialogClassName="modalCarrinho" show={modalCarrinho} onHide={() => setModalCarrinho(false)}>
				<div className={styles.headerModalCarrinho}>
					<p>Carrinho</p>

					<RiCloseFill color="#FFF" size={20} onClick={() => setModalCarrinho(false)} />
				</div>


				{carrinho?.length > 0 ?
					<div className={styles.containerCarrinho}>
						{carrinho?.map((produto, index) =>
							<ProdutoCard produto={produto} key={index} />
						)}
					</div>
					:
					<div className={styles.containerNoProducts}>
						<img src={"/images/addCart.png"} width={100} height={100} />
						<p>Não há produtos cadastrados</p>
					</div>
				}

				<footer className={styles.footer}>
					<div className={styles.containerFooter}>
						<p>Subtotal</p>

						<p className={styles.precoTotalFooter}>{formatBRL(total)}</p>
					</div>

					<button onClick={handleFinalizarPedido} disabled={carrinho.length == 0} className={styles.btnFooter}>
						Finalizar pedido
					</button>
				</footer>
			</Modal>
		</>
	)
}
