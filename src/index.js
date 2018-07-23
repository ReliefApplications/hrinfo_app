import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from "react-router-dom";
import {CookiesProvider} from 'react-cookie';
import App from './containers/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './images/unocha-icons.css';
import registerServiceWorker from './utils/registerServiceWorker';

import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#007faa'
		},
		secondary: {
			main: '#E5F3F6'
		}
	}
});

//ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
	<MuiThemeProvider theme={theme}>
		<Router>
			<CookiesProvider>
				<CssBaseline/>
				<App/>
			</CookiesProvider>
		</Router>
	</MuiThemeProvider>,
	document.getElementById("root"));
registerServiceWorker();
