import '../styles/globals.scss'

import {
	createTheme,
	CssBaseline,
	responsiveFontSizes,
	ThemeProvider,
} from '@mui/material'

let theme = createTheme({
	typography: {
		fontFamily: ['poppins', 'allVariants'].join(','),
		h3: { fontWeight: 600 },
		h4: { fontWeight: 200 },
	},

	palette: {
		mode: 'dark',
		background: {
			default: '#16141F',
		},
		primary: {
			light: '#d45b07',
			main: '#FF715B',
			dark: '#BB4D3C',
			contrastText: '#fff',
		},
		secondary: {
			light: '#0c8b7c',
			main: '#09655a',
			dark: '#0c8b7c',
			contrastText: '#fff',
		},
		white: {
			light: '#efefef',
			main: '#fff',
			dark: '#efefef',
			contrastText: '#09655a',
		},
		error: {
			main: '#ff978f',
		},
	},
})

theme = responsiveFontSizes(theme)

export default function App({ Component, pageProps }) {
	return (
		<>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</>
	)
}
