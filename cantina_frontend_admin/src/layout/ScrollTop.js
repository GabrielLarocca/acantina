import React from "react";

export default class ScrollTop extends React.Component {
	scrollTopCommonRef = React.createRef();

	componentDidMount() {
		// const scrollTopOptions = { offset: 300, speed: 600 };
	}

	render() {
		return (
			<div id="kt_scrolltop" className="kt-scrolltop" ref={this.scrollTopCommonRef}>
				<i className="la la-arrow-up" />
			</div>
		);
	}
}
