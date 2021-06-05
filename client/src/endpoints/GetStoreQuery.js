import Axios from '../utils/Axios';

const GetStoreQuery = async (key, value) => {
	try {
		const { data } = await Axios.get(
			`${process.env.REACT_APP_BACKEND_URL}/food/store`,
			{
				params: {
					[key]: value,
				},
			}
		);
		console.log(data);
		return data;
	} catch (err) {
		console.log(err);
	}
};

export default GetStoreQuery;
