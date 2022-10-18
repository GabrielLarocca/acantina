import axios from "axios";
import { Constants } from '../utils/Constants';

export function create(data) {
	return axios.post(`${Constants.baseUrl}/categoria/`, data);
}

export function getDataTable(events) {
	return axios.post(`${Constants.baseUrl}/categoria/list`, events);
}

export function remove(id) {
	return axios.delete(`${Constants.baseUrl}/categoria/${id}`);
}

export function getProductCategory() {
	return axios.post(`${Constants.baseUrl}/categoria/listSimple`);
}