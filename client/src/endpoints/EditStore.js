import Axios from '../utils/Axios';

const EditStore = (storeId, payload) =>
	Axios.put(`${process.env.REACT_APP_BACKEND_URL}/food/${storeId}`, payload, {
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json',
		},
	});

export default EditStore;
