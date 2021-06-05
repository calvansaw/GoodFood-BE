import Axios from '../utils/Axios';

const GetByCenterRadius = async (lat, lng, dist) => {
	const { data } = await Axios.get(
		`${process.env.REACT_APP_BACKEND_URL}/location/store`,
		{
			params: { lat, lng, dist },
		}
	);
	return data;
};
export default GetByCenterRadius;
