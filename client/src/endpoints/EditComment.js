import Axios from '../utils/Axios';

const EditComment = (storeId, params, payload) =>
	Axios.put(
		`${process.env.REACT_APP_BACKEND_URL}/food/${storeId}/`,
		payload,
		{
			params,
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
			},
		}
	);

export default EditComment;
