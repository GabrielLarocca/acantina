import axios from "axios";
import { Constants } from '../utils/Constants';

export function login(email, password) {
	return axios.post(`${Constants.baseUrl}/auth`, { adm_email: email, adm_password: password });
}

export function logout() {

}