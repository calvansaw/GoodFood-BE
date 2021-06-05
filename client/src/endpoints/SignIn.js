import Axios from '../utils/Axios';

const SignIn = (payload) =>
	Axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, payload);

export default SignIn;
