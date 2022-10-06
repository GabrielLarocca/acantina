import axios from "axios";
import { Constants } from '../utils/Constants';

export function getDataTable(events) {
	return axios.post(`${Constants.baseUrl}/produto/list`, events);
}

export function create(values) {
	return axios.post(`${Constants.baseUrl}/produto/`, values);
}

export function remove(id) {
	console.log(id)
	return axios.delete(`${Constants.baseUrl}/produto/${id}`);
}