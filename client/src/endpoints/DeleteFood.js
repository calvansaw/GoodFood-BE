import Axios from '../utils/Axios';

const DeleteFood = (storeId, params) =>
	Axios.delete(`${process.env.REACT_APP_BACKEND_URL}/food/${storeId}/menu`, {
		params,
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json',
		},
	});

export default DeleteFood;
