import Header from '../components/Header'
import styles from '../styles/Home.module.css'
import { RiArrowRightSLine } from 'react-icons/ri';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCategorias } from '../store/ducks/produtos';
import Swal from 'sweetalert2';
import { Spinner } from 'react-bootstrap';

export default function Home() {
	const [loading, setLoading] = useState(true);
	const [categorias, setCategorias] = useState([]);

	useEffect(() => {
		getCategorias().then(res => {
			if (res?.status == 200) {
				if (res.data.errors) {
					return Swal.fire('Ops!', res?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
				} else {
					setCategorias(res.data)
				}
			}
		}).catch(({ response }) => {
			return Swal.fire('Ops!', response?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
		}).finally(() => {
			setLoading(false);
		});
	}, []);

	function BotaoInicial(props) {
		return (
			<Link href={{ pathname: '/produtos', query: { c: props.categoria, title: props.title } }}>
				<div className={styles.buttonInicial}>
					<p>{props.title}</p>
					<RiArrowRightSLine color='#787A7C' size={20} />
				</div>
			</Link>
		)
	}

	return (
		<>
			<Header />

			<div className={styles.container}>
				<div className={styles.containerBanner} />

				{loading ?
					<div className='d-flex justify-content-center'>
						<Spinner style={{ color: "#0CA364" }} size="md" animation="border" className={"spinner mt-5"} />
					</div>
					:
					<div className={styles.containerBtns}>
						{categorias.map((categoria, index) =>
							<BotaoInicial key={index} title={categoria?.cat_name} categoria={categoria?.id} />
						)}
					</div>
				}
			</div>
		</>
	)
}
