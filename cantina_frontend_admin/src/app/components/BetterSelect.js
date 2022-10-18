import React, { Component } from 'react';
import { OutlinedInput, InputLabel, FormControl, Select, FormHelperText } from "@material-ui/core";

export default class BetterSelect extends Component {
	render() {
		return (
			<FormControl variant="outlined" error={this.props.error ? this.props.error : false}>
				<InputLabel>{this.props.label}</InputLabel>

				<Select style={{ color: this.props.value == 'none' ? 'gray' : '#000', backgroundColor: this.props.backgroundColor ?? 'inherit' }} native value={this.props.value} name={this.props.name ? this.props.name : ""} disabled={this.props.disabled}
					onBlur={this.props.onBlur ? this.props.onBlur : null} onChange={this.props.onChange} margin="none"
					input={<OutlinedInput name={this.props.label} labelWidth={this.props.labelWidth} />}>

					{this.props.blankOption ?
						<option value="none" disabled>{this.props.placeholder ?? ''}</option> : null
					}

					{this.props.listItem?.map((obj, i) => {
						return (
							<>
								<option key={i} value={obj}>{obj}</option>
							</>
						)
					})}

					{this.props.children}
				</Select>

				{this.props.helperText ?
					<FormHelperText>{this.props.helperText}</FormHelperText>
					: null
				}
			</FormControl>
		);
	}
}