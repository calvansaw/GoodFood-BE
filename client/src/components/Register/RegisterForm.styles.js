import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	margin: {
		margin: theme.spacing(1),
	},
	textField: {
		width: '25ch',
	},
	selectField: {
		width: '15ch',
	},
}));

export default useStyles;
