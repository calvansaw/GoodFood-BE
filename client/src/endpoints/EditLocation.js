import Axios from '../utils/Axios';

const EditLocation = (locationId, payload) =>
	Axios.put(
		`${process.env.REACT_APP_BACKEND_URL}/location/${locationId}`,
		payload,
		{
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
			},
		}
	);

export default EditLocation;
