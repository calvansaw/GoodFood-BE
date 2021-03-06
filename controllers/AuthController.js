const express = require('express');
const router = express.Router();
const Middleware = require('../middlewares');
const User = require('../models/user.model');
const Token = require('../models/token.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

//@route POST /signup
router.post('/signup', async (req, res) => {
	try {
		//check if username is already taken:
		let user = await User.findOne({ username: req.body.username });
		if (user) {
			return res.status(400).json({ error: 'Username taken.' });
		} else {
			//create new user and generate a pair of tokens and send
			user = await new User(req.body).save();
			let accessToken = await user.createAccessToken();
			let refreshToken = await user.createRefreshToken();

			return res.status(201).json({ accessToken, refreshToken, user });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal Server Error!' });
	}
});

//@route POST /login
router.post('/login', async (req, res) => {
	try {
		//check if user exists in database:
		console.log(req.body);
		let user = await User.findOne({ username: req.body.username });
		//send error if no user found:
		if (!user) {
			return res.status(404).json({ error: 'No user found!' });
		} else {
			//check if password is valid:
			let valid = await bcrypt.compare(req.body.password, user.password);
			if (valid) {
				//generate a pair of tokens if valid and send
				let accessToken = await user.createAccessToken();
				let refreshToken = await user.createRefreshToken();

				return res
					.status(201)
					.json({ accessToken, refreshToken, user });
			} else {
				//send error if password is invalid
				return res.status(401).json({ error: 'Invalid password!' });
			}
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal Server Error!' });
	}
});

//@route POST /refresh_token
router.post('/refresh_token', async (req, res) => {
	try {
		//get refreshToken
		const { refreshToken } = req.body;
		//send error if no refreshToken is sent
		if (!refreshToken) {
			return res
				.status(403)
				.json({ error: 'Access denied,token missing!' });
		} else {
			//query for the token to check if it is valid:
			const tokenDoc = await Token.findOne({ token: refreshToken });
			//send error if no token found:
			if (!tokenDoc) {
				return res.status(401).json({ error: 'Token expired!' });
			} else {
				//extract payload from refresh token and generate a new access token and send it
				const payload = jwt.verify(
					tokenDoc.token,
					REFRESH_TOKEN_SECRET
				);
				const accessToken = jwt.sign(
					{ user: payload },
					ACCESS_TOKEN_SECRET,
					{
						expiresIn: '10m',
					}
				);
				return res.status(200).json({ accessToken });
			}
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal Server Error!' });
	}
});

//@route DELETE /logout
router.delete('/logout', async (req, res) => {
	try {
		//delete the refresh token saved in database:
		console.log(req.body);
		const { refreshToken } = req.body;
		await Token.findOneAndDelete({ token: refreshToken });
		return res.status(200).json({ success: 'User logged out!' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal Server Error!' });
	}
});

//@route GET /protected_resource
//@access to only authenticated users
router.get('/protected_resource', Middleware.checkAuth, (req, res) => {
	return res.status(200).json({ user: req.user });
});

module.exports = router;
