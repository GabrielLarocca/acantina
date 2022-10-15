import axios from "axios";
import { setLogout } from "../store/ducks/user";
import { useDispatch } from "react-redux";

export default function AxiosSetup(props) {
	const dispatch = useDispatch();

	const logout = () => {
		dispatch(setLogout());
		delete axios.defaults.headers.common["Authorization"];
	};

	let user = props.store.getState("user");

	if (user?.user?.token) {
		axios.defaults.headers.common["Authorization"] = `Bearer ${user?.user?.token}`;

		axios.interceptors.response.use(
			(response) => {
				return response;
			},
			(error) => {
				if (
					error?.response?.status == 401 &&
					error?.data?.message !== "invalid signature"
				) {
					logout();
					window.location.href = "/";
				}

				return Promise.reject(error);
			}
		);
	} else {
		logout();
	}

	return <>{props.children}</>;
}
