import Header from '../../components/Header'
import styles from '../../styles/Produto.module.css'
import { RiArrowLeftSLine } from 'react-icons/ri';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProdutos } from '../../crud/produtos';
import { RiAddFill, RiSubtractFill } from 'react-icons/ri'

export default function Produtos() {
	const { query, back } = useRouter();

	const [produto, setProduto] = useState({});
	const [quantidade, setQuantidade] = useState(1);

	useEffect(() => {
		//getProduto(router.pathname.params[0]).then(() => { }).catch(() => { });
		setProduto(
			{
				id: 1,
				imagem: '/test/image1.png',
				nome: 'X-Salada',
				descricao: 'Pão, frango desfiado com molho de iogurte, tomate fatiado, alface, picles, milho, maionese de alho e queijo mussarela.',
				preco: 15.00
			},
		)
	}, []);

	const handleQuantidade = (adicionar) => {
		if (adicionar) {
			setQuantidade(e => e + 1)
		} else if (!adicionar && quantidade > 1) {
			setQuantidade(e => e - 1)
		}
	}

	return (
		<>
			<Header />

			{produto ? (
				<>
					<div onClick={back} className={styles.imagemProduto} style={{ backgroundImage: `url(${produto.imagem})` }}>
						<div className={styles.voltarBtn}>
							<RiArrowLeftSLine color='#FFF' size={20} />
							<p>Voltar</p>
						</div>
					</div>

					<div className={styles.container}>
						<h1 className={styles.titulo}>{produto?.nome}</h1>
						<p className={styles.descricaoProduto}>{produto?.descricao}</p>
						<p className={styles.precoProduto}>R$ {produto?.preco}</p>
					</div>

					<footer className={styles.footer}>
						<div className={styles.containerFooter}>
							<div className={styles.incrementar}>
								<RiSubtractFill onClick={() => handleQuantidade(false)} />

								<p>{quantidade}</p>

								<RiAddFill onClick={() => handleQuantidade(true)} />
							</div>

							<p className={styles.precoTotalFooter}>R$ {produto.preco * quantidade}</p>
						</div>

						<button className={styles.btnFooter}>
							Adicionar ao carrinho
						</button>
					</footer>
				</>
			) : <></>}

		</>
	)
}
