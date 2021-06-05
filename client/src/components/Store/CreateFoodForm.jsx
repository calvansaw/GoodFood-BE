import React, { useState, useContext, useCallback } from 'react';
import clsx from 'clsx';
import {
	Grid,
	IconButton,
	Input,
	InputLabel,
	InputAdornment,
	Button,
	TextField,
} from '@material-ui/core';
import useStyles from './CreateFoodForm.styles';
import { Formik, useFormik } from 'formik';
import { AuthContext } from '../../contexts/AuthContext';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import { STORES } from '../../constants/queryKeys';
import * as yup from 'yup';
import CreateFood from '../../endpoints/CreateFood';

const CreateFoodForm = () => {
	let history = useHistory();
	const { id } = useParams();
	const { state, dispatch } = useContext(AuthContext);
	const { enqueueSnackbar } = useSnackbar();
	const queryClient = useQueryClient();
	const { mutate } = useMutation(
		(values) => {
			let payload = {
				foodName: values.foodName,
				foodDesc: values.foodDesc,
				foodImg: values.foodImg,
				price: values.price,
			};
			console.log(payload);
			console.log(id);
			return CreateFood(id, payload);
		},
		{
			onError: () => {
				enqueueSnackbar('Something went wrong, please try again!', {
					variant: 'error',
				});
			},
			onSuccess: () => {
				enqueueSnackbar('Create food successful!', {
					variant: 'success',
				});
				queryClient.invalidateQueries(STORES);
				history.push(`/store/menu/${id}`);
			},
		}
	);

	const submit = useCallback((values) => {
		console.log(values);
		mutate(values);
	}, []);

	const validationSchema = yup.object({
		foodName: yup.string().required('Food name is required'),
		foodDesc: yup.string().required('Food description is required'),
		foodImg: yup.string().required('An image url is required'),
		price: yup
			.number()
			.positive('Price cannot be 0')
			.required('Price is required'),
	});

	const { values, handleChange, handleBlur, handleSubmit, touched, errors } =
		useFormik({
			initialValues: {
				foodName: '',
				foodDesc: '',
				foodImg: '',
				price: 0,
			},
			validationSchema,
			onSubmit: submit,
		});
	const classes = useStyles();

	return (
		<form onSubmit={handleSubmit}>
			<Grid container className={classes.margin}>
				<Grid item xs={12}>
					<InputLabel htmlFor="foodName">Food Name</InputLabel>
					<TextField
						className={clsx(classes.margin, classes.textField)}
						id="foodName"
						name="foodName"
						type="text"
						value={values.foodName}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.foodName && Boolean(errors.foodName)}
						helperText={touched.foodName && errors.foodName}
					/>
				</Grid>
				<Grid item xs={12}>
					<InputLabel htmlFor="foodDesc">Food Description</InputLabel>
					<TextField
						className={clsx(classes.margin, classes.textField)}
						id="foodDesc"
						name="foodDesc"
						type="text"
						value={values.foodDesc}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.foodDesc && Boolean(errors.foodDesc)}
						helperText={touched.foodDesc && errors.foodDesc}
					/>
				</Grid>
				<Grid item xs={12}>
					<InputLabel htmlFor="foodImg">Food Image</InputLabel>
					<TextField
						className={clsx(classes.margin, classes.textField)}
						id="foodImg"
						name="foodImg"
						type="text"
						value={values.foodImg}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.foodImg && Boolean(errors.foodImg)}
						helperText={touched.foodImg && errors.foodImg}
					/>
				</Grid>
				<Grid item xs={12}>
					<InputLabel htmlFor="price">Price</InputLabel>
					<TextField
						className={clsx(classes.margin, classes.textField)}
						id="price"
						name="price"
						type="number"
						value={values.price}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.price && Boolean(errors.price)}
						helperText={touched.price && errors.price}
					/>
				</Grid>
			</Grid>
			<Button type="submit">Submit</Button>
		</form>
	);
};

export default CreateFoodForm;
