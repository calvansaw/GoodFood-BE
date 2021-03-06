import React, { useState, useContext, useMemo } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import StoreCard from './StoreCard';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogContent } from '@material-ui/core';
import EditLocationDialogForm from './EditLocationDialogForm';

const StoreHome = ({ stores, allLocations }) => {
	const { state } = useContext(AuthContext);

	const userStores = useMemo(
		() => stores.filter((store) => store.username === state.user.username),
		[stores, state.user.username]
	);

	const userLocations = useMemo(
		() =>
			allLocations.filter(
				(location) => location.username === state.user.username
			),
		[allLocations, state.user.username]
	);

	const [openEditLocationsDialog, setOpenEditLocationsDialog] =
		useState(false);

	const handleEditDialogOpen = () => {
		setOpenEditLocationsDialog(true);
	};
	const handleEditDialogClose = () => {
		setOpenEditLocationsDialog(false);
	};

	return (
		<>
			<Grid container alignItems="center" direction="column" wrap>
				<Grid item xs={12}>
					<Typography color="textPrimary" variant="h5">
						Your Store Homepage!
					</Typography>
				</Grid>
				<Grid item>
					<Link to="/store/create">
						<Button>Create Store</Button>
					</Link>
				</Grid>
				<Grid item>
					<Link to="/location/create">
						<Button>Create Location</Button>
					</Link>
				</Grid>
				<Grid item>
					<Button onClick={handleEditDialogOpen}>
						Edit Store Location
					</Button>
					<Dialog
						open={openEditLocationsDialog}
						onClose={handleEditDialogClose}
					>
						<DialogTitle>
							Change name or delete store location on map
						</DialogTitle>
						<Divider />
						<DialogContent>
							{userLocations.map((location, index) => (
								<EditLocationDialogForm
									key={index}
									location={location}
									closeDialog={setOpenEditLocationsDialog}
								/>
							))}
						</DialogContent>
						<Divider />
						<DialogActions>
							<Button onClick={handleEditDialogClose}>
								Cancel
							</Button>
						</DialogActions>
					</Dialog>
				</Grid>
			</Grid>

			<Grid container alignItems="center" direction="column">
				<Grid item xs={6}>
					{userStores.map((store, index) => (
						<Grid key={index} item xs={12}>
							<StoreCard store={store} />
						</Grid>
					))}
				</Grid>
			</Grid>
		</>
	);
};

export default StoreHome;
