import { actionTypes } from '../../app/store/ducks/auth.duck';

export function setupAxios(axios, store) {
	axios.interceptors.request.use(config => {
		const { auth: { authToken } } = store.getState();

		if (authToken) {
			config.headers.Authorization = `Bearer ${authToken}`;
		}

		return config;
	},
		err => Promise.reject(err)
	);

	axios.interceptors.response.use(function (response) {
		return response;
	}, function (error) {
		if (error.response.status == 401) {
			store.dispatch({ type: actionTypes.Logout, payload: null });
		}

		if (error.response.status == 403) {
			window.location.href = '/error';
		}

		return Promise.reject(error);
	});
}

export function removeCSSClass(ele, cls) {
	const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
	ele.className = ele.className.replace(reg, " ");
}

export function addCSSClass(ele, cls) {
	ele.classList.add(cls);
}

export const toAbsoluteUrl = pathname => process.env.PUBLIC_URL + pathname;

export function removeStorage(key) {
	try {
		localStorage.setItem(key, "");
		localStorage.setItem(key + "_expiresIn", "");
	} catch (e) {
		console.log("removeStorage: Error removing key [" + key + "] from localStorage: " + JSON.stringify(e));
		return false;
	}
	return true;
}

export function getStorage(key) {
	const now = Date.now();

	let expiresIn = localStorage.getItem(key + "_expiresIn");
	if (expiresIn === undefined || expiresIn === null) {
		expiresIn = 0;
	}

	expiresIn = Math.abs(expiresIn);
	if (expiresIn < now) {
		removeStorage(key);
		return null;
	} else {
		try {
			const value = localStorage.getItem(key);
			return value;
		} catch (e) {
			console.log("getStorage: Error reading key [" + key + "] from localStorage: " + JSON.stringify(e));
			return null;
		}
	}
}

export function setStorage(key, value, expires) {
	if (expires === undefined || expires === null) {
		expires = 24 * 60 * 60;
	}

	const now = Date.now();
	const schedule = now + expires * 1000;

	try {
		localStorage.setItem(key, value);
		localStorage.setItem(key + "_expiresIn", schedule);
	} catch (e) {
		console.log("setStorage: Error setting key [" + key + "] in localStorage: " + JSON.stringify(e));

		return false;
	}
	return true;
}

export const formatBRL = value => {
	const formatter = new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		minimumFractionDigits: 2
	});

	value = formatter.format(value);

	return value;
};

export const formatBRLInput = input => {
	input.target.value = Number(input.target.value.toString().replace(/[^0-9-]/g, '')) / 10 ** 2;

	input.target.value = formatBRL(input.target.value);

	return input;
};

export const limparMoeda = (valor) => {
	valor = valor.replace("R$", "");
	valor = valor.replace(".", "");
	valor = valor.replace(",", ".");
	valor = valor.replace('/^\p{Z}+|\p{Z}+$/u', '');
	valor = valor.trim();

	return valor
};