import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
	Login: "[Login] Action",
	Logout: "[Logout] Action",
	UserRequested: "[Request User] Action",
	UserLoaded: "[Load User] Auth API",
};

const initialAuthState = {
	user: undefined,
	authToken: undefined
};

export const reducer = persistReducer({ storage, key: "app-auth", whitelist: ["user", "authToken"] },
	(state = initialAuthState, action) => {
		switch (action.type) {
			case actionTypes.Login: {
				return {
					authToken: action.payload.token,
					user: action.payload.user
				};
			}

			case actionTypes.Logout: {
				return initialAuthState;
			}

			case actionTypes.UserLoaded: {
				return {
					...state,
					user: action.payload
				};
			}

			default:
				return state;
		}
	}
);

export const actions = {
	login: payload => ({ type: actionTypes.Login, payload }),
	logout: () => ({ type: actionTypes.Logout }),
	requestUser: payload => ({ type: actionTypes.UserRequested, payload }),
	fulfillUser: payload => ({ type: actionTypes.UserLoaded, payload })
};

export function* saga() {
}
