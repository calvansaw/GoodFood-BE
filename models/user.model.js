const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Token = require('./token.model');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

// Validators always receive the value to validate as their first argument and must return Boolean. Returning false means validation failed.
const validator = (val) => {
	return val === 'owner' || val === 'public';
};

//define schema
const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		userType: { type: String, required: true, validate: validator },
	},
	{ timestamps: true }
);

//define schema level methods to create access token and refresh token:
userSchema.methods = {
	createAccessToken: async function () {
		try {
			let { _id, username, userType } = this;
			let accessToken = jwt.sign(
				{ user: { _id, username, userType } },
				ACCESS_TOKEN_SECRET,
				{
					expiresIn: '10m',
				}
			);
			return accessToken;
		} catch (error) {
			console.log(error);
			return;
		}
	},
	createRefreshToken: async function () {
		try {
			let { _id, username } = this;
			let refreshToken = jwt.sign(
				{ user: { _id, username } },
				REFRESH_TOKEN_SECRET,
				{
					expiresIn: '1d',
				}
			);

			await new Token({ token: refreshToken }).save();
			return refreshToken;
		} catch (error) {
			console.log(error);
			return;
		}
	},
};

//pre save hook to hash password before saving user into the database:
userSchema.pre('save', async function (next) {
	try {
		let salt = await bcrypt.genSalt(12); // generate hash salt of 12 rounds
		let hashedPassword = await bcrypt.hash(this.password, salt); // hash the current user's password
		this.password = hashedPassword;
	} catch (error) {
		console.log(error);
	}
	return next();
});

module.exports = mongoose.model('User', userSchema);
