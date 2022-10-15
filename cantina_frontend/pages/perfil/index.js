import Header from '../../components/Header'
import styles from '../../styles/Perfil.module.css'
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { setLogout } from '../../store/ducks/user';
import { useEffect } from 'react';

export default function Perfil() {
	const { push, reload } = useRouter();
	const { user } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!user) {
			push('/');
		}
	}, [])

	const logout = () => {
		dispatch(setLogout());

		reload();
	}

	const handleRedirectButton = (title, link) => {
		if (title == 'Sair') {
			logout();
		} else {
			push(link);
		}
	}

	const Button = ({ title, link }) => (
		<Link href={link}>
			<div className={styles.button} onClick={() => handleRedirectButton(title, link)}>
				<div>
					<p>{title}</p>
				</div>

				<div>
					<RiArrowRightSLine color='#787A7C' size={20} />
				</div>
			</div>
		</Link>
	)

	return (
		<div className={styles.containerGeral}>
			<Header />

			<div className={styles.containerDesk}>
				<div onClick={() => push('/')} className={styles.voltarBtn}>
					<RiArrowLeftSLine color='#384047' size={20} />
					<p>Voltar</p>
				</div>

				<h1>Perfil</h1>

				<div className='d-flex'>
					<div className={styles.nameContainer}>{user?.usr_name?.slice(0, 1)}</div>

					<div className={styles.assets}>
						<p>{user?.usr_name}</p>
						<p>{user?.email}</p>
					</div>
				</div>

				<Button title={'Editar perfil'} link="/perfil/editar" />
				{/*<Button title={'Editar perfil'} link="/perfil/editar" /> */}
				<Button title={'Sair'} link="/" />
			</div>
		</div>
	)
}
