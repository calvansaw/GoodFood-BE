import React, { useState, useCallback, useContext } from 'react';
import clsx from 'clsx';
import {
	IconButton,
	TextField,
	InputLabel,
	InputAdornment,
	FormControlLabel,
	Radio,
	FormHelperText,
	Button,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import useStyles from './RegisterForm.styles';
import { useFormik } from 'formik';
import Register from '../../endpoints/Register';
import { AuthContext } from '../../contexts/AuthContext';
import { useMutation } from 'react-query';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

const RegisterForm = () => {
	const { state, dispatch } = useContext(AuthContext);
	const { enqueueSnackbar } = useSnackbar();
	const { mutate } = useMutation(
		(values) => {
			let payload = {
				username: values.username,
				password: values.password,
				avatar: values.avatar,
				userType: values.userType,
			};
			return Register(payload);
		},
		{
			onError: () => {
				enqueueSnackbar('Something went wrong, please try again!', {
					variant: 'error',
				});
			},
			onSuccess: (data) => {
				const resData = data.data;
				const jsonData = JSON.stringify(resData.user);
				localStorage.setItem('access', resData.accessToken);
				localStorage.setItem('refresh', resData.refreshToken);
				localStorage.setItem('user', jsonData);

				dispatch({
					type: 'REGISTER',
					data: resData,
				});
				enqueueSnackbar('User registered!', {
					variant: 'success',
				});
			},
		}
	);

	const submit = useCallback((values) => {
		mutate(values);
	}, []);

	const validationSchema = yup.object({
		username: yup.string().required('Username is required'),
		password: yup.string().required('Password is required'),
	});

	const { values, handleChange, handleBlur, handleSubmit, touched, errors } =
		useFormik({
			initialValues: {
				username: '',
				password: '',
				avatar: '',
				userType: 'public',
			},
			validationSchema,
			onSubmit: submit,
		});

	const classes = useStyles();
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};
	console.log(state);
	return (
		<form onSubmit={handleSubmit}>
			<InputLabel htmlFor="username">Username</InputLabel>
			<TextField
				className={clsx(classes.margin, classes.textField)}
				id="username"
				name="username"
				type="text"
				value={values.username}
				onChange={handleChange}
				onBlur={handleBlur}
				error={touched.username && Boolean(errors.username)}
				helperText={touched.username && errors.username}
			/>
			<InputLabel htmlFor="password">Password</InputLabel>
			<TextField
				className={clsx(classes.margin, classes.textField)}
				id="password"
				name="password"
				type={showPassword ? 'text' : 'password'}
				value={values.password}
				onChange={handleChange}
				onBlur={handleBlur}
				error={touched.password && Boolean(errors.password)}
				helperText={touched.password && errors.password}
				endAdornment={
					<InputAdornment position="end">
						<IconButton
							aria-label="toggle password visibility"
							onClick={handleClickShowPassword}
						>
							{values.showPassword ? (
								<Visibility />
							) : (
								<VisibilityOff />
							)}
						</IconButton>
					</InputAdornment>
				}
			/>
			<InputLabel htmlFor="avatar">Avatar</InputLabel>
			<TextField
				className={clsx(classes.margin, classes.textField)}
				id="avatar"
				name="avatar"
				type="text"
				value={values.avatar}
				onChange={handleChange}
			/>
			<FormControlLabel
				value="end"
				control={
					<Radio
						color="primary"
						id="userType"
						name="userType"
						value="owner"
						onChange={handleChange}
						checked={values.userType === 'owner'}
					/>
				}
				label="owner"
			/>
			<FormControlLabel
				value="end"
				control={
					<Radio
						color="primary"
						id="userType"
						name="userType"
						value="public"
						onChange={handleChange}
						checked={values.userType === 'public'}
					/>
				}
				label="public"
			/>
			<FormHelperText>
				Select Owner to start registering your store with us!
			</FormHelperText>
			<Button type="submit">Submit</Button>
		</form>
	);
};

export default RegisterForm;
