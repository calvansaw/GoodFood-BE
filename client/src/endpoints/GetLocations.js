import Axios from '../utils/Axios';

const GetLocations = async () => {
	const { data } = await Axios.get(
		`${process.env.REACT_APP_BACKEND_URL}/location`
	);
	return data;
};
export default GetLocations;
