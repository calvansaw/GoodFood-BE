import Axios from '../utils/Axios';

const SignOut = async () => {
	try {
		const refreshToken = localStorage.getItem('refresh');

		const { data } = await Axios.delete(
			`${process.env.REACT_APP_BACKEND_URL}/auth/logout`,
			{
				headers: {
					Accept: 'application/json, text/plain, */*',
					'Content-Type': 'application/json',
				},
				data: { refreshToken },
			}
		);

		localStorage.clear();
		return data;
	} catch (err) {
		console.log(err);
	}
};

export default SignOut;
