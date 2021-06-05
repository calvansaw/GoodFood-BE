import React, {
	useState,
	useContext,
	useCallback,
	forwardRef,
	useImperativeHandle,
} from 'react';
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
import useStyles from './EditStoreDialogForm.styles';
import { Formik, useFormik } from 'formik';
import { AuthContext } from '../../contexts/AuthContext';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import { STORES } from '../../constants/queryKeys';
import * as yup from 'yup';
import EditStore from '../../endpoints/EditStore';

const EditStoreDialogForm = forwardRef(
	({ storeId, closeDialog, store }, ref) => {
		// let history = useHistory();
		// const { id } = useParams();
		// const { state, dispatch } = useContext(AuthContext);
		const { enqueueSnackbar } = useSnackbar();
		const queryClient = useQueryClient();
		const { mutate } = useMutation(
			(values) => {
				let payload = {
					storeName: values.storeName,
					storeDesc: values.storeDesc,
					storeImg: values.storeImg,
				};
				// console.log(payload);
				// console.log(id);
				return EditStore(storeId, payload);
			},
			{
				onError: () => {
					enqueueSnackbar('Something went wrong, please try again!', {
						variant: 'error',
					});
				},
				onSuccess: () => {
					enqueueSnackbar('Edit store successful!', {
						variant: 'success',
					});
					queryClient.invalidateQueries(STORES);
					closeDialog();
				},
			}
		);

		const submit = useCallback((values) => {
			console.log(values);
			mutate(values);
		}, []);

		const validationSchema = yup.object({
			storeName: yup.string().required('Store name is required'),
			storeDesc: yup.string().required('Store description is required'),
			storeImg: yup.string().required('An image url is required'),
		});

		const formik = useFormik({
			initialValues: {
				storeName: store.storeName,
				storeDesc: store.storeDesc,
				storeImg: store.storeImg,
			},
			validationSchema,
			onSubmit: submit,
			innerRef: ref,
			validateOnChange: false,
		});

		const {
			values,
			handleChange,
			handleBlur,
			handleSubmit,
			touched,
			errors,
		} = formik;

		//need to set ref values directly using this useImperativeHandle hook
		useImperativeHandle(ref, () => ({
			...formik,
		}));

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
							error={
								touched.storeName && Boolean(errors.storeName)
							}
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
							error={
								touched.storeDesc && Boolean(errors.storeDesc)
							}
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
			</form>
		);
	}
);

export default EditStoreDialogForm;
