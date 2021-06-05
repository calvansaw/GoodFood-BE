import Axios from '../utils/Axios';

const CreateFood = (id, payload) =>
	Axios.post(`${process.env.REACT_APP_BACKEND_URL}/food/${id}/menu`, payload);

export default CreateFood;
