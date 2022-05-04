import '../styles/globals.scss'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#772a54',
		},
		secondary: {
			main: '#d79162',
		},
	},
})

function MyApp({ Component, pageProps }) {
	return (
		<ThemeProvider theme={darkTheme}>
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default MyApp
