import Axios from '../utils/Axios';

const GetAllStore = async () => {
	try {
		const { data } = await Axios.get(
			`${process.env.REACT_APP_BACKEND_URL}/food`
		);
		return data;
	} catch (err) {
		console.log(err);
	}
};

export default GetAllStore;
