export const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const createFormikValidation = (formMap, values) => {
	const errors = {};

	for (let [key, value] of formMap) {
		if (!values[key]) {
			errors[key] = value + " é obrigatório.";
		} else if (key === 'password' && values[key].length < 6) {
			errors[key] = "Precisa de pelo menos 6 caracteres.";
		} else if (key === 'confirm' && values[key] !== values['password']) {
			errors[key] = "As senhas são diferentes.";
		} else if (key === 'email' && !regexEmail.test(values[key])) {
			errors[key] = "O e-mail utilizado é invalido.";
		} else if (key === 'usr_zip_code' && values[key].length < 5) {
			errors[key] = "Utilize 8 caracteres.";
		}
	}

	return errors;
};

export const validateLogin = values => {
	let map = new Map();

	map.set('email', 'E-mail');
	map.set('password', 'Senha');

	let errors = createFormikValidation(map, values);

	return errors;
};

export const validateRegister = values => {
	let map = new Map();

	map.set('usr_name', 'Nome');
	map.set('email', 'E-mail');
	map.set('password', 'Senha');

	// map.set('cpf', 'CPF');
	// map.set('celular', 'Celular');

	let errors = createFormikValidation(map, values);

	return errors;
};

export const validateEditPerfil = values => {
	let map = new Map();

	map.set('usr_name', 'Nome');
	map.set('email', 'E-mail');

	if (values.password.length > 0) {
		map.set('password', 'Senha');
	}

	// map.set('cpf', 'CPF');
	// map.set('celular', 'Celular');

	let errors = createFormikValidation(map, values);

	return errors;
};

export const validateProduto = (values) => {
	let map = new Map();

	map.set('pro_name', 'Nome');
	map.set('pro_description', 'Descrição');
	map.set('pro_category_id', 'Categoria');
	map.set('pro_price', 'Preço');
	//map.set('pro_image', 'Imagem');

	let errors = createFormikValidation(map, values);

	return errors;
};

export const validateCartao = (values) => {
	let map = new Map();

	map.set('nome_cartao', 'nome do cartão');
	map.set('numero_cartao', 'número do cartão');
	map.set('vencimento', 'vencimento');
	map.set('cvv', 'cvv');

	let errors = createFormikValidation(map, values);

	return errors;
};

export const formatBRLNoSign = (value) => {
	const formatter = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
		symbol: "",
	});

	value = formatter.format(value).replace("R$", "");

	return value;
};

export const formatBRL = (value) => {
	const formatter = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
		minimumFractionDigits: 2,
	});

	value = formatter.format(value);

	return value;
};

export const limparMoeda = (valor) => {
	valor = valor.replace("R$", "");
	valor = valor.replace(".", "");
	valor = valor.replace(",", ".");
	valor = valor.replace("/^p{Z}+|p{Z}+$/u", "");
	valor = valor.trim();

	if (valor == '') return 0;

	return valor;
};