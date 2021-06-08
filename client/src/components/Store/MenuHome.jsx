import React, { useContext, useMemo } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import { AuthContext } from '../../contexts/AuthContext';
import { Link, useParams } from 'react-router-dom';
import FoodCard from './FoodCard';

const MenuHome = ({ stores }) => {
	const { id } = useParams();
	const { state } = useContext(AuthContext);

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
