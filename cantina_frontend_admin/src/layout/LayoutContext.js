import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const LayoutContext = {
	State: createContext(null),
	Dispatch: createContext(null)
};

const actionTypes = {
	INIT: "INIT",
	SET_SUBHEADER: "SET_SUBHEADER",
	SHOW_SPLASH_SCREEN: "SHOW_SPLASH_SCREEN",
	HIDE_SPLASH_SCREEN: "HIDE_SPLASH_SCREEN"
};

function findPageConfig(currentPage, items, breadcrumbs) {
	if (!items || !Array.isArray(items)) {
		return;
	}

	for (const item of items) {
		if (currentPage === item.page && !item.submenu) {
			return item;
		}

		if (item.submenu) {
			const pageConfig = findPageConfig(currentPage, item.submenu, breadcrumbs);

			if (pageConfig) {
				breadcrumbs.push(item);
				return pageConfig;
			}
		}
	}
}

function init({ pathname, menuConfig }) {
	const currentPage = pathname.slice(1);
	let breadcrumbs = [];

	const pageConfig = findPageConfig(currentPage, menuConfig.aside.items, breadcrumbs) || findPageConfig(currentPage, menuConfig.header.items, breadcrumbs);

	breadcrumbs.reverse();

	const state = { subheader: { title: "", breadcrumb: [], description: "" }, splashScreen: { refs: {} } };

	if (pageConfig) {
		breadcrumbs.push(pageConfig);
		state.subheader.title = pageConfig.title;
		state.subheader.breadcrumb = breadcrumbs;
	}

	return state;
}

function reducer(state, { type, payload }) {
	if (type === actionTypes.INIT) {
		const nextState = init(payload);

		return { ...state, subheader: nextState.subheader };
	}

	if (type === actionTypes.SET_SUBHEADER) {
		return { ...state, subheader: payload };
	}

	if (type === actionTypes.SHOW_SPLASH_SCREEN) {
		return { ...state, splashScreen: { ...state.splashScreen, refs: { ...state.splashScreen.refs, [payload.id]: true } } };
	}

	if (type === actionTypes.HIDE_SPLASH_SCREEN) {
		const { [payload.id]: skip, ...nextRefs } = state.splashScreen.refs;

		return { ...state, splashScreen: { ...state.splashScreen, refs: nextRefs } };
	}

	return state;
}

export function LayoutContextProvider({ history, children, menuConfig }) {
	const [state, dispatch] = useReducer(reducer, { menuConfig, pathname: history.location.pathname }, init);

	useEffect(() =>
		history.listen(({ pathname }) => {
			dispatch({ type: actionTypes.INIT, payload: { pathname, menuConfig } });
		}
		), [history, menuConfig]);

	const { refs: splashScreenRefs } = state.splashScreen;
	const splashScreenVisible = useMemo(() => Object.keys(splashScreenRefs).length > 0, [splashScreenRefs]);

	useEffect(() => {
		const splashScreen = document.getElementById("splash-screen");

		if (splashScreenVisible) {
			splashScreen.classList.remove("hidden");

			return () => {
				splashScreen.classList.add("hidden");
			};
		}

		const timeout = setTimeout(() => {
			splashScreen.classList.add("hidden");
		}, 1000);

		return () => {
			clearTimeout(timeout);
		};
	}, [splashScreenVisible]);

	return (
		<LayoutContext.State.Provider value={state}>
			<LayoutContext.Dispatch.Provider value={dispatch}>
				{children}
			</LayoutContext.Dispatch.Provider>
		</LayoutContext.State.Provider>
	);
}

export const LayoutContextConsumer = LayoutContext.State.Consumer;

export function useLayoutContext() {
	const context = useContext(LayoutContext.State);

	if (!context) {
		throw new Error("");
	}

	return context;
}

export function LayoutSubheader({ title, breadcrumb, description }) {
	const dispatch = useContext(LayoutContext.Dispatch);

	useEffect(() => {
		dispatch({ type: actionTypes.SET_SUBHEADER, payload: { title, breadcrumb, description } });
	}, [dispatch, title, breadcrumb, description]);

	return null;
}

export function LayoutSplashScreen({ visible = false }) {
	const dispatch = useContext(LayoutContext.Dispatch);

	useEffect(() => {
		if (!visible) {
			return;
		}

		const id = Math.random();

		dispatch({ type: actionTypes.SHOW_SPLASH_SCREEN, payload: { id } });

		return () => { dispatch({ type: actionTypes.HIDE_SPLASH_SCREEN, payload: { id } }); };
	}, [visible, dispatch]);

	return null;
}
