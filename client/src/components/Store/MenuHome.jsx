import React, { useState, useContext, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import {
	Grid,
	IconButton,
	Input,
	InputLabel,
	InputAdornment,
	Button,
	Typography,
} from '@material-ui/core';
// import useStyles from './XXXForm.styles';
import { Formik, useFormik } from 'formik';
import { AuthContext } from '../../contexts/AuthContext';
import GetStoreQuery from '../../endpoints/GetStoreQuery';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Route, Switch, Redirect } from 'react-router-dom';
import CreateStoreForm from './CreateStoreForm';
import FoodCard from './FoodCard';
import { useQuery } from 'react-query';
import { STORES } from '../../constants/queryKeys';

const MenuHome = ({ stores }) => {
	const { id } = useParams();
	const { state } = useContext(AuthContext);
	// const { isLoading, isError, data, error } = useQuery(STORES, () =>
	// 	GetStoreQuery('username', state.user.username).then((stores) =>
	// 		stores.map((store, index) => (
	// 			<Grid key={index} item xs={12}>
	// 				<FoodCard food={store} />
	// 			</Grid>
	// 		))
	// 	)
	// );

	// isLoading && console.log('Loading...');
	// isError && console.log('There is an error:', error);

	const [store] = useMemo(
		() => stores.filter((store) => store._id === id),
		[stores, id]
	);

	const isCorrectUser = useMemo(
		() => state.user?.username === store.username,
		[state.user?.username, store.username]
	);

	return (
		<>
			<Grid container alignItems="center" direction="column" wrap>
				<Grid item xs={12}>
					<Typography color="textPrimary" variant="h2">
						Menu of {store.storeName}
					</Typography>
					<Typography color="textPrimary" variant="h5">
						Store ID: {id}
					</Typography>

					{isCorrectUser ? (
						<Grid item>
							<Link to={`/food/create/${id}`}>
								<Button> Create Food</Button>
							</Link>
						</Grid>
					) : (
						''
					)}
				</Grid>
			</Grid>

			<Grid container alignItems="center" direction="column">
				<Grid item xs={6}>
					{store.menu.map((food, index) => (
						<Grid key={index} item xs={12}>
							<FoodCard
								food={food}
								storeId={id}
								storeUser={store.username}
								storeAvatar={store.storeAvatar}
							/>
						</Grid>
					))}
				</Grid>
			</Grid>
		</>
	);
};

export default MenuHome;
