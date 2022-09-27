import React, { useEffect } from "react";
import * as auth from "../../store/ducks/auth.duck";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
// import { LayoutSplashScreen } from "../../../_metronic";

export default function Logout() {
	useEffect(() => {
		// const { hasAuthToken } = this.props;

		// dispatch(logout());
	}, [])

	// return hasAuthToken ? <LayoutSplashScreen /> : <Redirect to="/auth" />;
}
