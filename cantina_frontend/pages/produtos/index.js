import Header from '../../components/Header'
import styles from '../../styles/Produtos.module.css'
import { RiArrowLeftSLine } from 'react-icons/ri';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProdutos } from '../../store/ducks/produtos';
import Swal from 'sweetalert2';
import { formatBRL } from '../../helpers/validation';
import { Spinner } from 'react-bootstrap';
import { Constants } from '../../helpers/constants';

export default function Produtos() {
	const { query } = useRouter();

	const [produtos, setProdutos] = useState([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getProdutos({ pro_category_id: query.c, page: 0 }).then((res) => {
			if (res?.status == 200) {
				if (res.data.errors) {
					return Swal.fire('Ops!', res?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
				} else {
					setProdutos(res.data.data);
					setTotal(res.data.total);
					setCurrentPage(res.data.current_page);
				}
			}
		}).catch(({ response }) => {
			return Swal.fire('Ops!', response?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
		}).finally(() => {
			setLoading(false);
		});
	}, []);

	const loadMore = () => {
		getProdutos({ pro_category_id: query.c, page: currentPage }).then((res) => {
			if (res?.status == 200) {
				if (res.data.errors) {
					return Swal.fire('Ops!', res?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
				} else {
					setProdutos([...produtos, ...res.data.data]);
					setTotal(res.data.total);
					setCurrentPage(res.data.current_page);
				}
			}
		}).catch(({ response }) => {
			return Swal.fire('Ops!', response?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
		}).finally(() => {
			setLoading(false);
		});
	}

	const ProdutoCard = ({ produto }) => {
		return (
			<div>
				<Link href={{ pathname: `/produtos/${produto.id}` }}>
					<div className={`${styles.cardProduto}`}>
						<div className={styles.imagemProduto} style={produto?.pro_image_path ? { backgroundImage: `url(${Constants.imageUrl + produto?.pro_image_path})` } : {}} />
						{console.log(produto?.pro_image_path, Constants)}

						<p className={styles.nomeProduto}>{produto.pro_name}</p>
						<p className={styles.descricaoProduto}>{produto.pro_description}</p>
						<p className={styles.precoProduto}>{formatBRL(produto.pro_price)}</p>
					</div>
				</Link>
			</div>
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

				{loading ?
					<div className='d-flex justify-content-center'>
						<Spinner style={{ color: "#0CA364" }} size="md" animation="border" className={"spinner mt-5"} />
					</div>
					:
					produtos.length > 0 ?
						<>
							<div className={styles.produtosContainer}>
								{produtos?.map((produto, index) =>
									<ProdutoCard produto={produto} key={index} />
								)}
							</div>

							{produtos?.length < total && (
								<div className={styles.containerLoadMore}>
									<button className={styles.buttonP} onClick={loadMore} style={{ marginTop: 55 }}>
										Carregar mais
									</button>
								</div>
							)}
						</>
						:
						<div className={styles.containerNoProducts}>
							<img src={"/images/nothingHere.png"} width={100} height={100} />
							<p>Não há produtos cadastrados</p>
						</div>
				}
			</div>
		</>
	)
}
