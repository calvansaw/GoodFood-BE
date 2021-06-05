import React, {
	useState,
	useRef,
	useCallback,
	useMemo,
	useContext,
} from 'react';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';
import { STORES } from '../../constants/queryKeys';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
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
import DeleteFood from '../../endpoints/DeleteFood';
import moment from 'moment';
import CommentCard from './CommentCard';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import SettingsIcon from '@material-ui/icons/Settings';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import EditFoodDialogForm from './EditFoodDialogForm';
import { AuthContext } from '../../contexts/AuthContext';

const FoodCard = ({ food, storeId, storeUser, storeAvatar }) => {
	const { state } = useContext(AuthContext);
	const { enqueueSnackbar } = useSnackbar();
	const queryClient = useQueryClient();
	console.log(food);
	const { foodName, foodDesc, foodImg, price, comments, _id } = food;
	const classes = useStyles();
	const [expanded, setExpanded] = useState(false);
	const [open, setOpen] = useState(false);
	const handleDialogOpen = () => {
		setOpen(true);
	};
	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const handleDialogClose = () => {
		setOpen(false);
	};
	const formRef = useRef(null);

	const params = {
		food: _id,
	};

	const { mutate: deleteFood } = useMutation(
		() => DeleteFood(storeId, params),
		{
			onError: () => {
				enqueueSnackbar('Something went wrong, please try again!', {
					variant: 'error',
				});
			},
			onSuccess: () => {
				enqueueSnackbar('Food deleted!', {
					variant: 'success',
				});
				queryClient.invalidateQueries(STORES);
				// setDrawer(false);
			},
		}
	);

	const handleDelete = useCallback(() => deleteFood(), []);

	const isCorrectUser = useMemo(
		() => state.user?.username === storeUser,
		[state.user?.username, storeUser]
	);

	const defaultAvatar = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYsJ-ql4R35gpthswZYexF3-8t82OvlKda4Q&usqp=CAU`;

	return (
		<Card className={classes.root}>
			<CardHeader
				avatar={
					<Avatar
						aria-label="avatar"
						src={storeAvatar || defaultAvatar}
						className={classes.avatar}
					/>
				}
				action={
					isCorrectUser ? (
						<>
							<IconButton onClick={handleDialogOpen}>
								<SettingsIcon />
							</IconButton>
							<IconButton onClick={handleDelete}>
								<DeleteForeverIcon />
							</IconButton>
						</>
					) : (
						''
					)
				}
				title={foodName}
				subheader={`$ ${price}`}
			/>
			<Dialog open={open} onClose={handleDialogClose}>
				<DialogTitle id="edit-food">Edit Food</DialogTitle>
				<Divider />
				<DialogContent>
					<EditFoodDialogForm
						ref={formRef}
						storeId={storeId}
						foodId={_id}
						closeDialog={handleDialogClose}
						food={food}
					/>
				</DialogContent>
				<Divider />
				<DialogActions>
					<Button onClick={handleDialogClose}>Cancel</Button>
					<IconButton onClick={() => formRef.current?.submitForm()}>
						<DoneOutlineIcon />
					</IconButton>
				</DialogActions>
			</Dialog>
			<CardMedia
				className={classes.media}
				image={foodImg}
				title={foodName}
			/>
			<CardContent>
				<Typography variant="body2" color="textSecondary" component="p">
					{foodDesc}
				</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<IconButton
					className={clsx(classes.expand, {
						[classes.expandOpen]: expanded,
					})}
					onClick={handleExpandClick}
					aria-expanded={expanded}
					aria-label="show more"
				>
					<ExpandMoreIcon />
				</IconButton>
			</CardActions>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				{comments.map((comment, index) => (
					<CommentCard
						key={index}
						comment={comment}
						foodId={_id}
						storeId={storeId}
						setDrawer={setExpanded}
					/>
				))}
			</Collapse>

			<Grid container xs={12}>
				<CreateCommentForm foodId={_id} storeId={storeId} />
			</Grid>
		</Card>
	);
};

export default FoodCard;
