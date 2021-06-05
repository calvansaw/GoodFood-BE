import Axios from '../utils/Axios';

const CreateStore = (payload) =>
	Axios.post(`${process.env.REACT_APP_BACKEND_URL}/food`, payload);

export default CreateStore;
