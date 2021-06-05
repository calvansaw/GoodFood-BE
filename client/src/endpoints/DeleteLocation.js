import Axios from '../utils/Axios';

const DeleteLocation = (locationId) =>
	Axios.delete(
		`${process.env.REACT_APP_BACKEND_URL}/location/${locationId}`,
		{
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
			},
		}
	);

export default DeleteLocation;
