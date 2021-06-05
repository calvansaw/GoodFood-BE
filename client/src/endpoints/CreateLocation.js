import Axios from '../utils/Axios';

const CreateLocation = (payload) =>
	Axios.post(`${process.env.REACT_APP_BACKEND_URL}/location`, payload);

export default CreateLocation;
