import React, { useContext, useMemo } from 'react';
import {
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Menu,
	MenuItem,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import { AccountCircle } from '@material-ui/icons';
import { AuthContext } from '../../contexts/AuthContext';
import useStyles from './Navbar.styles';
import SignOut from '../../endpoints/SignOut';
import { useHistory, Link } from 'react-router-dom';

const Navbar = () => {
	// let history = useHistory();
	const { state, dispatch } = useContext(AuthContext);
	const { isAuth, isOwner } = useMemo(
		() => ({
			isAuth: state.isAuth,
			isOwner: state.user?.userType === 'owner',
		}),
		[state]
	);
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	// const handleMenu = (event) => {
	// 	setAnchorEl(event.currentTarget);
	// };

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSignOut = async () => {
		const data = await SignOut();
		data && dispatch({ type: 'LOGOUT' });
	};

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar className={classes.toolbar}>
					<IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-label="menu"
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						<Link to="/">GoodFood</Link>
					</Typography>
					<Typography variant="h6" className={classes.title}>
						<Link to="/register">Register</Link>
					</Typography>
					<Typography variant="h6" className={classes.title}>
						<Link to="/signin">Login</Link>
					</Typography>
					{state.isAuth && (
						<IconButton onClick={handleSignOut}>
							<ExitToAppOutlinedIcon />
						</IconButton>
					)}
					{state.isAuth && (
						<div>
							<Link to="/store">
								<IconButton
									aria-label="account of current user"
									aria-controls="menu-appbar"
									aria-haspopup="true"
									color="inherit"
								>
									<AccountCircle />
								</IconButton>
							</Link>
							<Menu
								id="menu-appbar"
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={open}
								onClose={handleClose}
							>
								<MenuItem onClick={handleClose}>
									Profile
								</MenuItem>
								<MenuItem onClick={handleClose}>
									My account
								</MenuItem>
							</Menu>
						</div>
					)}
				</Toolbar>
			</AppBar>
		</div>
	);
};

export default Navbar;
