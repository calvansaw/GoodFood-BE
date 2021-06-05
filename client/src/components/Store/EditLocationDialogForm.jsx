import React, { useState, useCallback, useContext, useMemo } from 'react';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import useStyles from './FoodCard.styles';
import CreateCommentForm from './CreateCommentForm';
import moment from 'moment';
import { TextField } from '@material-ui/core';
import { Formik, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';
import { ALL_LOCATIONS, LOCATIONS } from '../../constants/queryKeys';
import EditLocation from '../../endpoints/EditLocation';
import DeleteLocation from '../../endpoints/DeleteLocation';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { AuthContext } from '../../contexts/AuthContext';

const EditLocationDialogForm = ({ location, closeDialog }) => {
	const { _id, storeName } = location;
	const { state } = useContext(AuthContext);
	const { enqueueSnackbar } = useSnackbar();
	const queryClient = useQueryClient();

	const [expanded, setExpanded] = useState(false);
	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const { mutate: deleteLocation } = useMutation(() => DeleteLocation(_id), {
		onError: () => {
			enqueueSnackbar('Something went wrong, please try again!', {
				variant: 'error',
			});
		},
		onSuccess: () => {
			enqueueSnackbar('Location deleted!', {
				variant: 'success',
			});
			queryClient.invalidateQueries(ALL_LOCATIONS);
			queryClient.invalidateQueries(LOCATIONS);
			closeDialog(false);
		},
	});

	const handleDelete = useCallback(() => deleteLocation(), []);

	const { mutate: editLocation } = useMutation(
		(values) => EditLocation(_id, values),
		{
			onError: () => {
				enqueueSnackbar('Something went wrong, please try again!', {
					variant: 'error',
				});
			},
			onSuccess: () => {
				enqueueSnackbar('Edit location successful!', {
					variant: 'success',
				});
				queryClient.invalidateQueries(ALL_LOCATIONS);
				queryClient.invalidateQueries(LOCATIONS);
				setExpanded(!expanded);
			},
		}
	);

	const submit = useCallback((values) => {
		editLocation(values);
	}, []);

	const { values, handleChange, handleSubmit } = useFormik({
		initialValues: {
			storeName: storeName,
		},
		onSubmit: submit,
	});

	return (
		<Grid container direction="column" spacing={1}>
			<Grid item>
				<Typography paragraph>{storeName}</Typography>
				<Collapse in={expanded} timeout="auto" unmountOnExit>
					<form onSubmit={handleSubmit}>
						<TextField
							id="storeName"
							name="storeName"
							type="text"
							value={values.storeName}
							onChange={handleChange}
						></TextField>
					</form>
				</Collapse>
			</Grid>

			<Grid item>
				<Grid container justify="flex-end">
					<IconButton onClick={handleExpandClick} size="small">
						<EditIcon />
					</IconButton>
					<IconButton onClick={handleDelete} size="small">
						<DeleteIcon />
					</IconButton>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default EditLocationDialogForm;
