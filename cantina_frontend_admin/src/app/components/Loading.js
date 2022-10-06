import React, { Component } from 'react';
import Spinner from 'react-bootstrap/Spinner';

export default class Loading extends Component {
	render() {
		return (
			<>
				{this.props.loading ?
					<div className='w-100 h-100'>
						<Spinner animation="border" size='lg' color='#0CA364' />
					</div>
					:
					<>
						{this.props.children}
					</>
				}
			</>
		);
	}
}
