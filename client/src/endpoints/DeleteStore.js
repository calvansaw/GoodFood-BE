import Axios from '../utils/Axios';

const DeleteStore = (storeId) =>
	Axios.delete(`${process.env.REACT_APP_BACKEND_URL}/food/${storeId}`, {
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json',
		},
	});

export default DeleteStore;
