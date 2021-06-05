import Axios from '../utils/Axios';

const Register = (payload) =>
	Axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, payload);

export default Register;
