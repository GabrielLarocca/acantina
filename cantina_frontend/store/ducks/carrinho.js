import { Constants } from '../../helpers/constants';
import axios from 'axios';

export const getCarrinho = () => {
	return axios.post(`${Constants.baseUrl}/carrinho/list`);
}

export const storeCarrinho = data => {
	return axios.post(`${Constants.baseUrl}/carrinho/`, data);
}

export const deleteItemCarrinho = itemId => {
	return axios.delete(`${Constants.baseUrl}/carrinho/${itemId}`);
}