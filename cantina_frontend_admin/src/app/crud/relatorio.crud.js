import axios from "axios";
import { Constants } from '../utils/Constants';

export function getRelatorioGerais() {
	return axios.get(`${Constants.baseUrl}/relatorio/relatorioGeral`);
}