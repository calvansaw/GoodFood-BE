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
import useStyles from './CreateStoreForm.styles';
import { Formik, useFormik } from 'formik';
import { AuthContext } from '../../contexts/AuthContext';
import CreateStore from '../../endpoints/CreateStore';
import { useHistory } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import { STORES } from '../../constants/queryKeys';
import * as yup from 'yup';

const CreateStoreForm = () => {
	let history = useHistory();
	const { state, dispatch } = useContext(AuthContext);
	const { enqueueSnackbar } = useSnackbar();
	const queryClient = useQueryClient();
	const { mutate } = useMutation(
		(values) => {
			const avatar = state.user.avatar ? state.user.avatar : '';

			let payload = {
				storeName: values.storeName,
				storeDesc: values.storeDesc,
				storeImg: values.storeImg,
				storeAvatar: avatar,
				username: state.user.username,
			};
			return CreateStore(payload);
		},
		{
			onError: () => {
				enqueueSnackbar('Something went wrong, please try again!', {
					variant: 'error',
				});
			},
			onSuccess: (data) => {
				const resStoreId = data.data._id;
				enqueueSnackbar(
					`Create store successful! Your store ID is: ${resStoreId}`,
					{
						variant: 'success',
					}
				);
				queryClient.invalidateQueries(STORES);
				history.push('/location/create');
			},
		}
	);

	const submit = useCallback((values) => {
		mutate(values);
	}, []);

	const validationSchema = yup.object({
		storeName: yup.string().required('Store name is required'),
		storeDesc: yup.string().required('Store description is required'),
		storeImg: yup.string().required('An image url is required'),
	});

	const { values, handleChange, handleBlur, handleSubmit, touched, errors } =
		useFormik({
			initialValues: {
				storeName: '',
				storeDesc: '',
				storeImg: '',
			},
			validationSchema,
			onSubmit: submit,
		});
	const classes = useStyles();

	return (
		<form onSubmit={handleSubmit}>
			<Grid container className={classes.margin}>
				<Grid item xs={12}>
					<InputLabel htmlFor="storeName">Store Name</InputLabel>
					<TextField
						className={clsx(classes.margin, classes.textField)}
						id="storeName"
						name="storeName"
						type="text"
						value={values.storeName}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.storeName && Boolean(errors.storeName)}
						helperText={touched.storeName && errors.storeName}
					/>
				</Grid>
				<Grid item xs={12}>
					<InputLabel htmlFor="storeDesc">
						Store Description
					</InputLabel>
					<TextField
						className={clsx(classes.margin, classes.textField)}
						id="storeDesc"
						name="storeDesc"
						type="text"
						value={values.storeDesc}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.storeDesc && Boolean(errors.storeDesc)}
						helperText={touched.storeDesc && errors.storeDesc}
					/>
				</Grid>
				<Grid item xs={12}>
					<InputLabel htmlFor="storeImg">Store Image</InputLabel>
					<TextField
						className={clsx(classes.margin, classes.textField)}
						id="storeImg"
						name="storeImg"
						type="text"
						value={values.storeImg}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.storeImg && Boolean(errors.storeImg)}
						helperText={touched.storeImg && errors.storeImg}
					/>
				</Grid>
			</Grid>
			<Button type="submit">Submit</Button>
		</form>
	);
};

export default CreateStoreForm;
