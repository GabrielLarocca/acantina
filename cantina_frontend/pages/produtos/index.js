import Header from '../../components/Header'
import styles from '../../styles/Produtos.module.css'
import { RiArrowLeftSLine } from 'react-icons/ri';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProdutos } from '../../crud/produtos';

export default function Produtos() {
	const { query } = useRouter();

	const [produtos, setProdutos] = useState([]);

	useEffect(() => {
		//getProdutos(query.c).then(() => { }).catch(() => { });

		setProdutos([
			{
				id: 1,
				imagem: '/test/image1.png',
				nome: 'X-Salada',
				descricao: 'Pão, hamburguer, cebola roxa, alface, tomate...',
				preco: 'R$15,00'
			},
			{
				id: 1,
				imagem: '/test/image1.png',
				nome: 'X-Salada',
				descricao: 'Pão, hamburguer, cebola roxa, alface, tomate...',
				preco: 'R$15,00'
			},
			{
				id: 1,
				imagem: '/test/image1.png',
				nome: 'X-Salada',
				descricao: 'Pão, hamburguer, cebola roxa, alface, tomate...',
				preco: 'R$15,00'
			},
			{
				id: 1,
				imagem: '/test/image1.png',
				nome: 'X-Salada',
				descricao: 'Pão, hamburguer, cebola roxa, alface, tomate...',
				preco: 'R$15,00'
			},
			{
				id: 1,
				imagem: '/test/image1.png',
				nome: 'X-Salada',
				descricao: 'Pão, hamburguer, cebola roxa, alface, tomate...',
				preco: 'R$15,00'
			}
		])
	}, []);

	const ProdutoCard = ({ produto }) => {
		return (
			<Link href={{ pathname: `/produtos/${produto.id}` }}>
				<div className={styles.cardProduto}>
					<div className={styles.imagemProduto} style={{ backgroundImage: `url(${produto.imagem})` }} />

					<p className={styles.nomeProduto}>{produto.nome}</p>
					<p className={styles.descricaoProduto}>{produto.descricao}</p>
					<p className={styles.precoProduto}>{produto.preco}</p>
				</div>
			</Link>
		)
	}

	return (
		<>
			<Header />

			<div className={styles.container}>
				<Link href={'/'}>
					<div className={styles.voltarBtn}>
						<RiArrowLeftSLine color='#384047' size={20} />
						<p>Voltar</p>
					</div>
				</Link>

				<h1 className={styles.categoriaTitle}>{query.title}</h1>

				<div className={styles.containerProdutos}>
					{produtos.map((produto, index) => (
						<ProdutoCard produto={produto} key={index} />
					))}
				</div>

			</div>
		</>
	)
}
