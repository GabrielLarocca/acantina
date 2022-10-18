import axios from "axios";
import { Constants } from '../utils/Constants';

export function getDataTable(events) {
	return axios.post(`${Constants.baseUrl}/produto/list`, events);
}

export function create(values) {
	return axios.post(`${Constants.baseUrl}/produto/`, values);
}

export function edit(values) {
	return axios.post(`${Constants.baseUrl}/produto/edit`, values);
}

export function get(id) {
	return axios.get(`${Constants.baseUrl}/produto/${id}`);
}

export function remove(id) {
	return axios.delete(`${Constants.baseUrl}/produto/${id}`);
}