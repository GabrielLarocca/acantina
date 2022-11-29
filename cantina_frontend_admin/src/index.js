import React from 'react';
import ReactDOM from 'react-dom/client';

import store, { persistor } from "./app/store/store";
import axios from "axios";
import { setupAxios } from "./app/utils/utils";
import App from './App';
import "./index.css";

const { PUBLIC_URL } = process.env;

setupAxios(axios, store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App store={store} persistor={persistor} basename={PUBLIC_URL} />
	</React.StrictMode>
);