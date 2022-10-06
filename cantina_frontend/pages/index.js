import Header from '../components/Header'
import styles from '../styles/Home.module.css'
import { RiArrowRightSLine } from 'react-icons/ri';
import Link from 'next/link';

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


export default function Home() {
	return (
		<>
			<Header />

			<div className={styles.container}>
				<div className={styles.containerBanner} style={{ backgroundImage: 'url(/images/Banner.svg)' }} />

				<BotaoInicial title="Salgados prontos" categoria="salgado" />
				<BotaoInicial title="Sanduiche" categoria="sanduiche" />
				<BotaoInicial title="Pastéis" categoria="pastel" />
				<BotaoInicial title="Bebidas" categoria="bebida" />
				<BotaoInicial title="Doces" categoria="doce" />
			</div>
		</>
	)
}
