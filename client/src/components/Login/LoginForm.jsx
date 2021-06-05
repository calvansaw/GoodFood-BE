import React, { useState, useCallback, useContext } from 'react';
import clsx from 'clsx';
import {
	IconButton,
	TextField,
	InputLabel,
	InputAdornment,
	Button,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import useStyles from './LoginForm.styles';
import { useFormik } from 'formik';
import { AuthContext } from '../../contexts/AuthContext';
import SignIn from '../../endpoints/SignIn';
import { useMutation } from 'react-query';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

const LoginForm = () => {
	// let history = useHistory();
	const { state, dispatch } = useContext(AuthContext);
	const { enqueueSnackbar } = useSnackbar();
	const { mutate } = useMutation(
		(values) => {
			let payload = {
				username: values.username,
				password: values.password,
			};
			return SignIn(payload);
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
					type: 'LOGIN',
					data: resData,
				});
				enqueueSnackbar('Login successful!', {
					variant: 'success',
				});
			},
		}
	);

	const submit = useCallback(
		(values) => {
			mutate(values);
		},
		[mutate]
	);

	const validationSchema = yup.object({
		username: yup.string().required('Username is required'),
		password: yup.string().required('Password is required'),
	});

	const { values, handleChange, handleBlur, handleSubmit, touched, errors } =
		useFormik({
			initialValues: {
				username: '',
				password: '',
			},
			validationSchema,
			onSubmit: submit,
		});

	const classes = useStyles();
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

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
			<Button type="submit">Submit</Button>
		</form>
	);
};

export default LoginForm;
