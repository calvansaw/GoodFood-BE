import Axios from '../utils/Axios';

const EditFood = (storeId, foodId, payload) =>
	Axios.put(
		`${process.env.REACT_APP_BACKEND_URL}/food/${storeId}/`,
		payload,
		{
			params: {
				food: foodId,
			},
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
			},
		}
	);

export default EditFood;
