export const LocationReducer = (state, action) => {
	switch (action.type) {
		case 'INIT': {
			return {
				...state,
				lat: action.data.lat,
				lng: action.data.lng,
			};
		}
		case 'SHIFT': {
			return {
				...state,
				lat: action.data.lat,
				lng: action.data.lng,
				markerPosn: action.data.markerPosn,
			};
		}

		default:
			return state;
	}
};
