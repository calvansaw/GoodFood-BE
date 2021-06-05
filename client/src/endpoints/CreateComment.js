import Axios from '../utils/Axios';

const CreateComment = (storeId, foodId, payload) =>
	Axios.post(
		`${process.env.REACT_APP_BACKEND_URL}/food/${storeId}/comment`,
		payload,
		{
			params: {
				food: foodId,
			},
		}
	);

export default CreateComment;
