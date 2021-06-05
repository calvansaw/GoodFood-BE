import React, { createContext, useReducer } from 'react';
import { AuthReducer } from '../reducers/AuthReducer';

//for other components to use {dispatch} from AuthContext
export const AuthContext = createContext();

//to wrap provider components
const AuthContextProvider = ({ children }) => {
	const token = localStorage.getItem('access');
	const userJSON = localStorage.getItem('user');
	const userObj = JSON.parse(userJSON);

	const initialState = {
		isAuth: !!token,
		user: userObj,
	};
	const [state, dispatch] = useReducer(AuthReducer, initialState);

	return (
		<AuthContext.Provider value={{ state, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
