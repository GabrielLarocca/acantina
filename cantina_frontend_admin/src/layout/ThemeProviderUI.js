import React from "react";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/styles";

const theme = createMuiTheme(
	{
		typography: {
			fontFamily: ["Poppins"].join(",")
		},
		palette: {
			contrastThreshold: 2,
			primary: {
				main: "#0CA364"
			},
			secondary: {
				main: "#0abb87",
				contrastText: "#ffffff"
			},
			error: {
				main: "#fd397a"
			}
		},
		props: {
			MuiButtonBase: {
				disableRipple: true
			},
			MuiPopover: {
				elevation: 1
			}
		}
	}
);

export default function ThemeProvider(props) {
	const { children } = props;

	return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
