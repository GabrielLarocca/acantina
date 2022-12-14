import React, { Component } from "react";
import * as auth from "../../store/ducks/auth.duck";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

class Logout extends Component {
	componentDidMount() {
		this.props.logout();
	}

	render() {
		const { hasAuthToken } = this.props;

		return hasAuthToken && <Navigate to="/auth" />
	}
}

export default connect(({ auth }) => ({ hasAuthToken: Boolean(auth.authToken) }), auth.actions)(Logout);