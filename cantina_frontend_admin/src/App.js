import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Routes from "./app/router/Routes";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./layout/ThemeProviderUI";
import 'bootstrap/dist/css/bootstrap.css'
import '../src/styles/styles';

export default function App({ store, persistor, basename }) {
	return (
		<Provider store={store}>
			{/* TODO add SPLASHCREEN screen */}
			<PersistGate persistor={persistor} loading={() => { }}>
				<React.Suspense fallback={() => { }}>
					<BrowserRouter basename={basename}>
						<ThemeProvider>
							<Routes />
						</ThemeProvider>
					</BrowserRouter>
				</React.Suspense>
			</PersistGate>
		</Provider>
	);
}
