import React, { useContext, useMemo, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import LoginForm from './components/Login/LoginForm';
import { Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import RegisterForm from './components/Register/RegisterForm';
import { AuthContext } from './contexts/AuthContext';
import { LocationContext } from './contexts/LocationContext';
import StoreHome from './components/Store/StoreHome';
import PublicHome from './components/Home/PublicHome';
import MenuHome from './components/Store/MenuHome';
import { useQuery, useQueries } from 'react-query';
import { STORES, LOCATIONS, ALL_LOCATIONS } from './constants/queryKeys';
import GetAllStore from './endpoints/GetAllStore';
import GetLocations from './endpoints/GetLocations';
import GetByCenterRadius from './endpoints/GetByCenterRadius';
import { Grid } from '@material-ui/core';
import StoreCard from './components/Store/StoreCard';
import CreateLocationForm from './components/Store/CreateLocationForm';
import CreateStoreForm from './components/Store/CreateStoreForm';
import CreateFoodForm from './components/Store/CreateFoodForm';

const App = () => {
	const { state } = useContext(AuthContext);
	const { state: locationState, dispatch: locationDispatch } =
		useContext(LocationContext);
	const { lat, lng } = locationState;
	const dist = 800;
	const { enqueueSnackbar } = useSnackbar();
	const [stores, locations, allLocations] = useQueries([
		{
			queryKey: STORES,
			queryFn: () => GetAllStore(),
			refetchOnWindowFocus: false,
		},
		{
			queryKey: [LOCATIONS, lat, lng, dist],
			queryFn: () => GetByCenterRadius(lat, lng, dist),
			refetchOnWindowFocus: false,
		},
		{
			queryKey: ALL_LOCATIONS,
			queryFn: () => GetLocations(),
			refetchOnWindowFocus: false,
		},
	]);
	stores.isLoading &&
		enqueueSnackbar('Stores loading...', {
			variant: 'info',
		});
	locations.isLoading &&
		enqueueSnackbar('Locations loading...', {
			variant: 'info',
		});
	allLocations.isLoading &&
		enqueueSnackbar('All Locations loading...', {
			variant: 'info',
		});
	if (stores.isError) {
		enqueueSnackbar('Error loading stores!', {
			variant: 'error',
		});
		console.log(stores.error);
	}
	if (locations.isError) {
		enqueueSnackbar('Error loading locations!', {
			variant: 'error',
		});
		console.log(locations.error);
	}
	if (allLocations.isError) {
		enqueueSnackbar('Error loading All Locations!', {
			variant: 'error',
		});
		console.log(locations.error);
	}

	const { isAuth, isOwner } = useMemo(
		() => ({
			isAuth: state.isAuth,
			isOwner: Boolean(state.user?.userType === 'owner'),
		}),
		[state]
	);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((posn) => {
			locationDispatch({
				type: 'INIT',
				data: { lat: posn.coords.latitude, lng: posn.coords.longitude },
			});
		});
	}, []);

	return (
		<div className="App">
			<Navbar />
			<div className="content">
				<Switch>
					<Route path="/signin">
						{isAuth ? <Redirect to="/" /> : <LoginForm />}
					</Route>
					<Route path="/register">
						{isAuth ? <Redirect to="/" /> : <RegisterForm />}
					</Route>
					<Route exact path="/location/create">
						{isOwner ? <CreateLocationForm /> : <Redirect to="/" />}
					</Route>
					<Route exact path="/store/create">
						{isOwner ? <CreateStoreForm /> : <Redirect to="/" />}
					</Route>
					<Route exact path="/store/menu/:id">
						{stores.data && <MenuHome stores={stores.data} />}
					</Route>
					<Route exact path="/store">
						{isOwner && stores.data ? (
							<StoreHome
								stores={stores.data}
								allLocations={allLocations.data}
							/>
						) : (
							<Redirect to="/" />
						)}
					</Route>
					<Route exact path="/food/create/:id">
						<CreateFoodForm />
					</Route>
					<Route exact path="/">
						<PublicHome
							stores={stores.data}
							locations={locations.data}
							allLocations={allLocations.data}
						/>
					</Route>
				</Switch>
			</div>
		</div>
	);
};

export default App;
