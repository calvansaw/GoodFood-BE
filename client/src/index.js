import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthContextProvider from './contexts/AuthContext';
import LocationContextProvider from './contexts/LocationContext';
import ThemeContextProvider from './contexts/ThemeContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { SnackbarProvider } from 'notistack';

const queryClient = new QueryClient();

ReactDOM.render(
	<React.StrictMode>
		<AuthContextProvider>
			<LocationContextProvider>
				<ThemeContextProvider>
					<SnackbarProvider maxSnack={3}>
						<QueryClientProvider client={queryClient}>
							<Router>
								<App />
								<ReactQueryDevtools initialIsOpen={false} />
							</Router>
						</QueryClientProvider>
					</SnackbarProvider>
				</ThemeContextProvider>
			</LocationContextProvider>
		</AuthContextProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
