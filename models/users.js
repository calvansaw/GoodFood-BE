const mongoose = require('mongoose');

// Validators always receive the value to validate as their first argument and must return Boolean. Returning false means validation failed.
const validator = (val) => {
	return val === 'owner' || val === 'public';
};

// Create custom validation error msg, {PATH} refers to the property name
const custom = [validator, 'Uh oh, {PATH} does not equal owner or public.'];

////create schema//////
const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		userType: { type: String, required: true, validate: custom },
	},
	{ timestamps: true }
);

////create model/////
const User = mongoose.model('User', userSchema);

////export/////
module.exports = User;
