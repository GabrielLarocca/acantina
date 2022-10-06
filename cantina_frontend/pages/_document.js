import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html>
				<Head>
					<meta charSet='UTF-8' />
					<meta httpEquiv='X-UA-Compatible' content='IE=edge' />
					<meta name='description' content='Peça agora na cantina online seu lanche, e pegue-o fresquinho e sem fila!' />
					<meta name='keywords' content='Keywords' />
					<meta name="theme-color" content="#fff" />
				</Head>

				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument;