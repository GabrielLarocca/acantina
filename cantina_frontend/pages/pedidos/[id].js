import Header from '../../components/Header'
import styles from '../../styles/Pedido.module.css'
import { RiArrowLeftSLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getPedido } from '../../store/ducks/pedido';
import { Spinner } from 'react-bootstrap';
import { formatBRL } from '../../helpers/validation';

export default function Pedido() {
	const { back, push, query } = useRouter();

	const [pedido, setPedido] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getPedido(query?.id).then((res) => {
			if (res?.status == 200) {
				if (res.data.errors) {
					return Swal.fire('Ops!', res?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
				} else {
					let pedido = res.data;
					pedido.nf_decoded = JSON.parse(pedido?.ord_nf);

					setPedido(pedido);
				}
			}
		}).catch(({ response }) => {
			return Swal.fire('Ops!', response?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
		}).finally(() => {
			setLoading(false);
		});
	}, []);

	const getColor = () => {
		if (pedido?.ord_state_order == 'cancelado') {
			return '#ff6347'
		} else if (pedido?.ord_state_order == 'aguardando') {
			return '#0CA364'
		} else if (pedido?.ord_state_order == 'finalizado') {
			return '#384047'
		}
	}

	return (
		<div className={styles.containerGeral}>
			<Header />

			<div className={styles.containerDesk}>
				<div onClick={back} className={styles.voltarBtn}>
					<RiArrowLeftSLine color='#384047' size={20} />
					<p>Voltar</p>
				</div>

				{loading ?
					<div className='d-flex justify-content-center'>
						<Spinner style={{ color: "#0CA364" }} size="md" animation="border" className={"spinner mt-5"} />
					</div>
					:
					<div style={{ padding: '0 24px' }}>
						<p className={styles.status} style={{ color: getColor() }}>{pedido?.ord_state_order}</p>

						<h1>Pedido {pedido?.id}#</h1>

						{pedido.nf_decoded.data.map((item, index) => (
							<div key={index} className={styles.flexItem}>
								<p>{item?.quantity}x</p>

								<p>{item?.produto?.pro_name}</p>

								<p>{formatBRL(item?.totalPrice)}</p>
							</div>
						))}

						<hr className={styles.line} />

						{/* <div className={styles.descontoContainer}>
							<p>Desconto</p>

							<p>-{formatBRL(12.90)}</p>
						</div> */}

						<hr className={styles.line} />

						<div className={styles.totalContainer}>
							<p>Total</p>

							<p>{formatBRL(pedido?.nf_decoded?.total)}</p>
						</div>

					</div>
				}
			</div>
		</div>
	)
}
