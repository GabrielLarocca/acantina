import Router from 'next/router';
import Head from 'next/head';
import { useStore } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import NProgress from 'nprogress';
import { storeWrapper } from "../store/storeConfig";
import AxiosSetup from '../helpers/axios';

import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';

Router.events.on('routeChangeStart', url => {
	NProgress.start();
});

Router.events.on('routeChangeComplete', () => {
	NProgress.done();
});

Router.events.on('routeChangeError', () => {
	NProgress.done();
});

function MyApp({ Component, pageProps }) {
	const store = useStore((state) => state);
	return (
		<>
			<Head>
				<link rel='stylesheet' type='text/css' href='/css/nprogress.css' />
			</Head>

			<PersistGate persistor={store.__persistor} loading={""}>
				<AxiosSetup store={store}>
					<Component {...pageProps} />
				</AxiosSetup>
			</PersistGate>
		</>
	)
}

export default storeWrapper.withRedux(MyApp);