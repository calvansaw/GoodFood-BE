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
import useStyles from './CreateCommentForm.styles';
import { Formik, useFormik } from 'formik';
import { AuthContext } from '../../contexts/AuthContext';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import { STORES } from '../../constants/queryKeys';
import * as yup from 'yup';
import CreateComment from '../../endpoints/CreateComment';

const CreateCommentForm = ({ foodId, storeId }) => {
	let history = useHistory();
	// const { id } = useParams();
	const { state, dispatch } = useContext(AuthContext);
	const { enqueueSnackbar } = useSnackbar();
	const queryClient = useQueryClient();
	const { mutate } = useMutation(
		(values) => {
			if (!values.name.length) values.name = 'Anonymous';
			let payload = {
				name: values.name,
				comment: values.comment,
				username: state.user.username,
			};
			// console.log(payload);
			// console.log(id);
			return CreateComment(storeId, foodId, payload);
		},
		{
			onError: () => {
				enqueueSnackbar('Something went wrong, please try again!', {
					variant: 'error',
				});
			},
			onSuccess: () => {
				enqueueSnackbar('Create comment successful!', {
					variant: 'success',
				});
				queryClient.invalidateQueries(STORES);
				history.push(`/store/menu/${storeId}`);
			},
		}
	);

	const submit = useCallback((values) => {
		console.log(values);
		mutate(values);
		resetForm();
	}, []);

	const validationSchema = yup.object({
		comment: yup.string().required('Enter a comment'),
	});

	const {
		values,
		handleChange,
		handleBlur,
		handleSubmit,
		touched,
		errors,
		resetForm,
	} = useFormik({
		initialValues: {
			name: '',
			comment: '',
		},
		validationSchema,
		onSubmit: submit,
	});
	const classes = useStyles();

	return (
		<form onSubmit={handleSubmit}>
			<Grid container className={classes.margin}>
				<Grid item xs={12}>
					{/* <InputLabel htmlFor="name">Food Name</InputLabel> */}
					<TextField
						className={clsx(classes.margin, classes.textField)}
						id="name"
						name="name"
						type="text"
						value={values.name}
						onChange={handleChange}
						placeholder="Name"
						// onBlur={handleBlur}
						// error={touched.name && Boolean(errors.name)}
						// helperText={touched.name && errors.name}
					/>
				</Grid>
				<Grid item xs={12}>
					{/* <InputLabel htmlFor="comment">Food Description</InputLabel> */}
					<TextField
						className={clsx(classes.margin, classes.textField)}
						id="comment"
						name="comment"
						type="text"
						value={values.comment}
						onChange={handleChange}
						placeholder="Comments..."
						onBlur={handleBlur}
						error={touched.comment && Boolean(errors.comment)}
						helperText={touched.comment && errors.comment}
					/>
				</Grid>
			</Grid>
			<Grid container item justify="flex-end" xs={12}>
				<Button type="submit">Comment</Button>
			</Grid>
		</form>
	);
};

export default CreateCommentForm;
