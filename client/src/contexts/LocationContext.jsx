import React, { createContext, useReducer } from 'react';
import { LocationReducer } from '../reducers/LocationReducer';

export const LocationContext = createContext();

//to wrap provider components
const LocationContextProvider = ({ children }) => {
	const initialState = {
		lat: 0,
		lng: 0,
		markerPosn: {},
	};
	const [state, dispatch] = useReducer(LocationReducer, initialState);

	return (
		<LocationContext.Provider value={{ state, dispatch }}>
			{children}
		</LocationContext.Provider>
	);
};

export default LocationContextProvider;
