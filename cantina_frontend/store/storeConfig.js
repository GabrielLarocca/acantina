import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createWrapper } from "next-redux-wrapper";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunk from 'redux-thunk';
import user from './ducks/user';

const reducers = combineReducers({ user });

const makeStore = ({ isServer }) => {
	if (isServer) {
		// If it's on server side, create a store
		return createStore(reducers, composeWithDevTools());
	} else {
		// If it's on client side, create a store which will persist
		const { persistStore, persistReducer } = require("redux-persist");
		const storage = require("redux-persist/lib/storage").default;

		const persistConfig = {
			key: "nextjs",
			whitelist: ["user"], // Add reducers to persist
			storage
		};

		const store = createStore(persistReducer(persistConfig, reducers), compose(applyMiddleware(thunk)));

		store.__persistor = persistStore(store);

		return store;
	}
};

export const storeWrapper = createWrapper(makeStore, { debug: false });
