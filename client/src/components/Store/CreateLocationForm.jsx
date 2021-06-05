import React, { useState, useEffect, useContext, useCallback } from 'react';
import clsx from 'clsx';
import {
	Grid,
	IconButton,
	Input,
	InputLabel,
	InputAdornment,
	Button,
	FormHelperText,
	TextField,
} from '@material-ui/core';
import useStyles from './CreateLocationForm.styles';
import { Formik, useFormik } from 'formik';
import { AuthContext } from '../../contexts/AuthContext';
import { LocationContext } from '../../contexts/LocationContext';
import CreateLocation from '../../endpoints/CreateLocation';
import { useHistory } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import { ALL_LOCATIONS, LOCATIONS } from '../../constants/queryKeys';
import Map from '../Map/Map';
import * as yup from 'yup';

const CreateLocationForm = () => {
	let history = useHistory();
	const { state } = useContext(AuthContext);
	const { state: locationState } = useContext(LocationContext);
	const { enqueueSnackbar } = useSnackbar();
	const queryClient = useQueryClient();
	const { mutate } = useMutation(
		(values) => {
			let payload = {
				storeName: values.storeName,
				storeId: values.storeId,
				location: {
					type: 'Point',
					coordinates: [values.longitude, values.latitude],
				},
				address: values.address,
				username: state.user.username,
			};
			return CreateLocation(payload);
		},
		{
			onError: () => {
				enqueueSnackbar('Something went wrong, please try again!', {
					variant: 'error',
				});
			},
			onSuccess: () => {
				enqueueSnackbar('Create location successful!', {
					variant: 'success',
				});
				queryClient.invalidateQueries(ALL_LOCATIONS);
				history.push('/store');
			},
		}
	);

	const submit = useCallback((values) => {
		mutate(values);
	}, []);

	const validationSchema = yup.object({
		storeName: yup.string().required('Store name is required'),
		storeId: yup.string().required('Store ID is required'),
		latitude: yup.number().required('Store latitude is required'),
		longitude: yup.number().required('Store longitude is required'),
		address: yup.string().required('Store address is required'),
	});

	const {
		values,
		handleChange,
		handleBlur,
		handleSubmit,
		setFieldValue,
		touched,
		errors,
	} = useFormik({
		initialValues: {
			storeName: '',
			storeId: '',
			latitude: 0,
			longitude: 0,
			address: '',
		},
		validationSchema,
		onSubmit: submit,
		validateOnChange: false,
	});

	useEffect(() => {
		setFieldValue('latitude', locationState.lat, false);
		setFieldValue('longitude', locationState.lng, false);
	}, [locationState.lat, locationState.lng, setFieldValue]);
	useEffect(() => {
		setFieldValue(
			'address',
			locationState.markerPosn.formatted_address,
			false
		);
	}, [locationState.markerPosn.formatted_address, setFieldValue]);

	const classes = useStyles();

	return (
		<Grid container>
			<Grid item>
				<form onSubmit={handleSubmit}>
					<Grid container className={classes.margin}>
						<Grid item xs={12}>
							<InputLabel htmlFor="storeName">
								Store Name
							</InputLabel>
							<TextField
								className={clsx(
									classes.margin,
									classes.textField
								)}
								id="storeName"
								name="storeName"
								type="text"
								onChange={handleChange}
								onBlur={handleBlur}
								error={
									touched.storeName &&
									Boolean(errors.storeName)
								}
								helperText={
									touched.storeName && errors.storeName
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<InputLabel htmlFor="storeId">Store ID</InputLabel>
							<TextField
								className={clsx(
									classes.margin,
									classes.textField
								)}
								id="storeId"
								name="storeId"
								type="text"
								onChange={handleChange}
								onBlur={handleBlur}
								error={
									touched.storeId && Boolean(errors.storeId)
								}
								helperText={touched.storeId && errors.storeId}
							/>
						</Grid>
						<Grid item xs={12}>
							<InputLabel htmlFor="latitude">Latitude</InputLabel>
							<TextField
								className={clsx(
									classes.margin,
									classes.textField
								)}
								id="latitude"
								name="latitude"
								type="number"
								value={values.latitude}
								onChange={handleChange}
								onBlur={handleBlur}
								error={
									touched.latitude && Boolean(errors.latitude)
								}
								helperText={touched.latitude && errors.latitude}
							/>
						</Grid>
						<Grid item xs={12}>
							<InputLabel htmlFor="longitude">
								Longitude
							</InputLabel>
							<TextField
								className={clsx(
									classes.margin,
									classes.textField
								)}
								id="longitude"
								name="longitude"
								type="number"
								value={values.longitude}
								onChange={handleChange}
								onBlur={handleBlur}
								error={
									touched.longitude &&
									Boolean(errors.longitude)
								}
								helperText={
									touched.longitude && errors.longitude
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<InputLabel htmlFor="address">Address</InputLabel>
							<TextField
								className={clsx(
									classes.margin,
									classes.textField
								)}
								id="address"
								name="address"
								type="text"
								value={values.address}
								onChange={handleChange}
								onBlur={handleBlur}
								error={
									touched.address && Boolean(errors.address)
								}
								helperText={touched.address && errors.address}
							/>
						</Grid>
					</Grid>
					<FormHelperText>
						Store name should be same as when create store!
					</FormHelperText>
					<Button type="submit">Submit</Button>
				</form>
			</Grid>
			<Grid item>
				<Map
					googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
					loadingElement={<div style={{ height: `100%` }} />}
					containerElement={
						<div
							style={{
								position: 'fixed',
								width: '45%',
								height: '60%',
								top: '15%',
								right: '2%',
							}}
						/>
					}
					mapElement={<div style={{ height: `100%` }} />}
				/>
			</Grid>
		</Grid>
	);
};

export default CreateLocationForm;
