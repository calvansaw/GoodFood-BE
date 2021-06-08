import React, { useState, useCallback, useContext, useMemo } from 'react';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { TextField } from '@material-ui/core';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';
import { STORES } from '../../constants/queryKeys';
import EditComment from '../../endpoints/EditComment';
import DeleteComment from '../../endpoints/DeleteComment';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { AuthContext } from '../../contexts/AuthContext';

const CommentCard = ({ comment, foodId, storeId, setDrawer }) => {
	const { state } = useContext(AuthContext);
	const { enqueueSnackbar } = useSnackbar();
	const queryClient = useQueryClient();

	const [expanded, setExpanded] = useState(false);
	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const params = {
		food: foodId,
		comment: comment._id,
	};

	const { mutate: deleteComment } = useMutation(
		() => DeleteComment(storeId, params),
		{
			onError: () => {
				enqueueSnackbar('Something went wrong, please try again!', {
					variant: 'error',
				});
			},
			onSuccess: () => {
				enqueueSnackbar('Comment deleted!', {
					variant: 'success',
				});
				queryClient.invalidateQueries(STORES);
				setDrawer(false);
			},
		}
	);

	const handleDelete = useCallback(() => deleteComment(), []);

	const { mutate: editComment } = useMutation(
		(values) => EditComment(storeId, params, values),
		{
			onError: () => {
				enqueueSnackbar('Something went wrong, please try again!', {
					variant: 'error',
				});
			},
			onSuccess: () => {
				enqueueSnackbar('Edit comment successful!', {
					variant: 'success',
				});
				queryClient.invalidateQueries(STORES);
				setExpanded(!expanded);
			},
		}
	);

	const submit = useCallback((values) => {
		console.log(values);
		editComment(values);
	}, []);

	const { values, handleChange, handleSubmit } = useFormik({
		initialValues: {
			comment: comment.comment,
		},
		onSubmit: submit,
	});

	const isCorrectUser = useMemo(
		() => state.user?.username === comment.username,
		[state.user?.username, comment.username]
	);

	return (
		<CardContent>
			<Typography variant="body2" color="textSecondary" component="p">
				Comments by {comment.name}:
			</Typography>
			<Typography paragraph>{comment.comment}</Typography>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<form onSubmit={handleSubmit}>
					<TextField
						id="comment"
						name="comment"
						type="text"
						value={values.comment}
						onChange={handleChange}
					></TextField>
				</form>
			</Collapse>
			<Grid container justify="flex-end">
				{isCorrectUser ? (
					<>
						<IconButton onClick={handleExpandClick} size="small">
							<EditIcon />
						</IconButton>
						<IconButton onClick={handleDelete} size="small">
							<DeleteIcon />
						</IconButton>
					</>
				) : (
					''
				)}
			</Grid>
			<Typography variant="body2" color="textSecondary" component="p">
				{moment(comment.updatedAt).format('dddd DD MMMM YYYY hh:mm:ss')}
			</Typography>
		</CardContent>
	);
};

export default CommentCard;
