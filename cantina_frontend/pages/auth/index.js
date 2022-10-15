import Header from '../../components/Header'
import { RiArrowLeftSLine } from 'react-icons/ri';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/Auth.module.css'

export default function Auth() {
	const router = useRouter();

	return (
		<>
			<Header />

			<div className={styles.containerDesk}>
				<div className={styles.container}>
					<Link href={'/'}>
						<div className={styles.voltarBtn}>
							<RiArrowLeftSLine color='#384047' size={20} />
							<p>Voltar</p>
						</div>
					</Link>

					<h1 className={styles.title}>Conta</h1>

					<p className={styles.subtitle}>Deseja vincular seu pedido a uma conta? Assim você mantém um histórico dos seus pedidos.</p>

					<button className={styles.buttonP} onClick={() => router.push('/auth/login')} style={{ marginTop: 55 }}>Fazer o login</button>

					<button className={styles.buttonP} onClick={() => router.push('/auth/registro')} style={{ marginTop: 12 }}>Criar uma conta</button>

					{/*
				//TODO ATIVAR QUANDO TIVER CARRINHO ARMAZENADO EM LOCAL STORAGE
				<div className={styles.line}>
					<div />
					<p>ou</p>
					<div />
				</div>

				<button className={styles.buttonS} style={{ marginTop: 24 }}>Continuar sem conta</button> */}
				</div>
			</div>
		</>
	)
}
