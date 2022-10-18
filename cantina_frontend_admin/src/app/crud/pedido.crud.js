import axios from "axios";
import { Constants } from '../utils/Constants';

export function getDataTable(events) {
	return axios.post(`${Constants.baseUrl}/pedido/list`, events);
}

export function getDataTableConcluidos(events) {
	return axios.post(`${Constants.baseUrl}/pedido/listConcluidos`, events);
}

export function editPedidoStatus(values) {
	return axios.post(`${Constants.baseUrl}/pedido/editPedidoStatus`, values);
}