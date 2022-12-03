import { Constants } from '../../helpers/constants';
import axios from 'axios';

export const storePedido = data => {
	return axios.post(`${Constants.baseUrl}/pedido/`, data);
}

export const listPedidos = () => {
	return axios.post(`${Constants.baseUrl}/pedido/list`);
}

export const getPedido = pedidoId => {
	return axios.get(`${Constants.baseUrl}/pedido/${pedidoId}`);
}

export const deletePedido = pedidoId => {
	return axios.delete(`${Constants.baseUrl}/pedido/${pedidoId}`);
}

export const checkCupomExist = data => {
	return axios.post(`${Constants.baseUrl}/pedido/checkCupom`, data);
}
