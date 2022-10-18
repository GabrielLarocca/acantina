import axios from "axios";
import { Constants } from '../utils/Constants';

export function getProductCategory() {
	return axios.post(`${Constants.baseUrl}/categoria/list`);
}