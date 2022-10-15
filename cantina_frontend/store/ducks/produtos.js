import { Constants } from '../../helpers/constants';
import axios from 'axios';

export const getProdutos = (data) => {
	return axios.post(`${Constants.baseUrl}/produtos/list`, data);
}

export const getProduto = (id) => {
	return axios.get(`${Constants.baseUrl}/produtos/${id}`,);
}

export const getCategorias = () => {
	return axios.post(`${Constants.baseUrl}/categoria/list`);
}