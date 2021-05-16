const mongoose = require('mongoose');

// Validators always receive the value to validate as their first argument and must return Boolean. Returning false means validation failed.
const validator = (val) => {
	return val === 'owner' || val === 'public';
};

// Need to use regular function for 'this' value
function isOwner() {
	return this.userType === 'owner';
}

// Create custom validation error msg, {PATH} refers to the property name
const custom = [validator, 'Uh oh, {PATH} does not equal owner or public.'];

////create schema//////
const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		password: { type: String, required: true },
		userType: { type: String, required: true, validate: custom },
		stores: {
			type: [String],
			default: undefined,
			required: isOwner,
		},
	},
	{ timestamps: true }
);

////create model/////
const User = mongoose.model('User', userSchema);

////export/////
module.exports = User;
