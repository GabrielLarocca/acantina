import Head from 'next/head'
import styles from '../styles/Header.module.css'

import { RiShoppingCart2Fill, RiMenuFill, RiCloseFill } from 'react-icons/ri';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { getCarrinho } from '../crud/carrinho';

export default function Header(props) {
	const [modalCarrinho, setModalCarrinho] = useState(false);
	const [menu, setMenu] = useState(false);
	const [carrinho, setCarrinho] = useState({});
	const [selected, setSelected] = useState('home');

	useEffect(() => {
		// getCarrinho().then((res) => {
		// if(res.status == 200){
		// setCarrinho(res.data);
		// }
		// }).catch(({response}) => {
		// if(response.data.errors[0]){

		// }
		// })

		setCarrinho({
			total: 35,
			produtos: [
				{
					id: 1,
					imagem: '/test/image1.png',
					nome: 'X-Salada',
					descricao: 'Pão, frango desfiado com molho de iogurte, tomate fatiado, alface, picles, milho, maionese de alho e queijo mussarela.',
					preco: 15.00,
					quantidade: 2
				}
			]
		})
	}, [])

	const ProdutoCard = ({ produto }) => (
		<div className={styles.cardCarrinho}>
			<div className={styles.imagemCarrinho} style={{ backgroundImage: `url(${produto.imagem})` }} />

			<div className={styles.infoCarrinho}>
				<p className={styles.nomeCarrinho}>{produto.nome}</p>
				<p className={styles.quantidadeCarrinho}>{produto.quantidade}  {produto.quantidade > 1 ? 'unidades' : 'unidade'}</p>
				<p className={styles.precoCarrinho}>R$ {produto.preco}</p>
			</div>

			<div>
				<RiCloseFill size={20} color={'#787A7C'} />
			</div>
		</div>
	)

	const ModalCarrinho = () => (
		<Modal dialogClassName="modalCarrinho" show={modalCarrinho} onHide={() => setModalCarrinho(false)}>
			<div className={styles.headerModalCarrinho}>
				<p>Carrinho</p>

				<RiCloseFill color="#FFF" size={20} onClick={() => setModalCarrinho(false)} />
			</div>

			{carrinho?.produtos?.map((produto, index) => (
				<ProdutoCard produto={produto} key={index} />
			))}

			<footer className={styles.footer}>
				<div className={styles.containerFooter}>
					<p>Subtotal</p>

					<p className={styles.precoTotalFooter}>R$ {carrinho.total}</p>
				</div>

				<button className={styles.btnFooter}>
					Finalizar pedido
				</button>
			</footer>
		</Modal>
	)

	const MenuLateral = () => (
		<Modal fullscreen scrollable={false} dialogClassName="modalMenu" show={menu} onHide={() => setMenu(false)}>
			<header style={{ height: 82 }} className={styles.header}>
				<RiCloseFill color="#FFF" size={20} onClick={() => setMenu(false)} />

				<Image width={90} height={30} src="/images/ACantina_logoWhite.svg" alt='logo da loja' />

				<RiShoppingCart2Fill color='#FFF' size={20} onClick={() => { setModalCarrinho(true); setMenu(false) }} />
			</header>

			<div className={styles.menuLateral}>
				<div className={selected == 'home' ? styles.selectedItemLateral : styles.itemLateral}>
					Início
				</div>

				<div className={[styles.itemLateral]}>
					Seus Pedidos
				</div>

				<div className={[styles.itemLateral]}>
					Perfil
				</div>
			</div>
		</Modal>
	)

	return (
		<>
			<Head>
				<title>A cantina - Loja</title>
			</Head>

			<MenuLateral />

			<header className={styles.header}>
				<RiMenuFill color="#FFF" size={20} onClick={() => setMenu(true)} />

				<Image width={90} height={30} src="/images/ACantina_logoWhite.svg" alt='logo da loja' />

				<RiShoppingCart2Fill color='#FFF' size={20} onClick={() => setModalCarrinho(true)} />
			</header>

			<ModalCarrinho />
		</>
	)
}
