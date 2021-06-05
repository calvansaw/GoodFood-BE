import Axios from 'axios';

Axios.defaults.withCredentials = true;

// Add a request interceptor
Axios.interceptors.request.use(
	function (config) {
		// Do something before request is sent

		config.headers.Authorization = `Bearer ${localStorage.access}`;

		return config;
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error);
	}
);

// // Add a response interceptor
Axios.interceptors.response.use(
	function (response) {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		return response;
	},
	function (error) {
		let originalRequest = error.config;
		let refreshToken = localStorage.refresh;

		if (
			refreshToken &&
			error.response.status == 401 &&
			!originalRequest._retry
		) {
			return Axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/auth/refresh_token`,
				{
					refreshToken: refreshToken,
				}
			).then((res) => {
				if (res.status == 200) {
					localStorage.setItem('access', res.data.accessToken);
					// localStorage.setItem('refresh', res.data.refreshToken);

					return Axios(originalRequest);
				}
			});
		}
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		return Promise.reject(error);
	}
);

export default Axios;
