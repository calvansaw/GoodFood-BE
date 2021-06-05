import Axios from '../utils/Axios';

const DeleteComment = (storeId, params) =>
	Axios.delete(
		`${process.env.REACT_APP_BACKEND_URL}/food/${storeId}/comment`,
		{
			params,
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
			},
		}
	);

export default DeleteComment;
