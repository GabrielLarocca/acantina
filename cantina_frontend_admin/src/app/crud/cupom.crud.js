import axios from "axios";
import { Constants } from '../utils/Constants';

export function getDataTable(events) {
	return axios.post(`${Constants.baseUrl}/cupom/list`, events);
}

export function create(data) {
	return axios.post(`${Constants.baseUrl}/cupom`, data);
}

export function remove(id) {
	return axios.delete(`${Constants.baseUrl}/cupom/${id}`);
}