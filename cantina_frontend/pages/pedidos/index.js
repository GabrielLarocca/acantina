import Header from '../../components/Header'
import styles from '../../styles/Pedidos.module.css'
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { listPedidos } from '../../store/ducks/pedido';
import { Spinner } from 'react-bootstrap';
import moment from 'moment';
import { useSelector } from 'react-redux';

export default function Pedidos() {
	const { back, push } = useRouter();
	const { user } = useSelector((state) => state.user);

	const [pedidos, setPedidos] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (user) {
			listPedidos().then((res) => {
				if (res?.status == 200) {
					if (res.data.errors) {
						return Swal.fire('Ops!', res?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
					} else {
						setPedidos(res.data);
					}
				}
			}).catch(({ response }) => {
				return Swal.fire('Ops!', response?.data?.errors?.[0] ?? 'Ocorreu um erro no nosso servidor, entre em contato com o suporte.', 'error');
			}).finally(() => {
				setLoading(false);
			});
		} else {
			push('/auth');
		}
	}, []);

	const getColor = (pedido) => {
		if (pedido?.ord_state_order == 'cancelado') {
			return '#ff6347'
		} else if (pedido?.ord_state_order == 'aguardando') {
			return '#0CA364'
		} else if (pedido?.ord_state_order == 'finalizado') {
			return '#384047'
		}
	}

	const PedidoCard = ({ pedido }) => {
		const nfReal = JSON.parse(pedido?.ord_nf);

		return (
			<div className={styles.card} onClick={() => push(`/pedidos/${pedido?.id}`)}>
				<div style={{ flex: 1 }}>
					<h4>Pedido #{pedido?.id}</h4>

					<div className={styles.assets}>
						<p style={{ color: getColor(pedido) }}>{pedido?.ord_state_order}</p>
						<p>{moment(pedido?.created_at).format('DD/MM/YYYY [às] hh:mm')}</p>
						<p>{nfReal?.data?.length} ite{nfReal?.data?.length > 1 ? 'ns' : 'm'}</p>
					</div>
				</div>

				<div className={styles.arrowGo}>
					<RiArrowRightSLine color='#787A7C' size={20} />
				</div>
			</div>
		)

	}

	return (
		<div className={styles.containerGeral}>
			<Header />

			<div className={styles.containerDesk}>
				<div onClick={back} className={styles.voltarBtn}>
					<RiArrowLeftSLine color='#384047' size={20} />
					<p>Voltar</p>
				</div>

				<h1>Seus pedidos</h1>

				{loading ?
					<div className='d-flex justify-content-center'>
						<Spinner style={{ color: "#0CA364" }} size="md" animation="border" className={"spinner mt-5"} />
					</div>
					:
					pedidos.length > 0 ?
						pedidos.map((pedido, index) => (
							<PedidoCard pedido={pedido} key={index} />
						))
						:
						<div className={styles.containerNoProducts}>
							<img src={"/images/nothingHere.png"} width={100} height={100} />
							<p>Não há pedidos cadastrados</p>
						</div>
				}
			</div>
		</div>
	)
}
