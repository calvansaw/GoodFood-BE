import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	toolbar: {
		backgroundColor: theme.palette.secondary.main,
	},
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
}));

export default useStyles;
