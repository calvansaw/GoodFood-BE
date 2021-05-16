const mongoose = require('mongoose');

// // Validators always receive the value to validate as their first argument and must return Boolean. Returning false means validation failed.
// const validator = (val) => {
// 	return val === 'owner' || val === 'public';
// };

// // Create custom validation error msg, {PATH} refers to the property name
// const custom = [validator, 'Uh oh, {PATH} does not equal owner or public.'];

////create schema//////
const locationSchema = new mongoose.Schema(
	{
		storeName: { type: String, required: true },
		address: { type: String, required: true },
		point: {
			lat: { type: String, required: true },
			lng: { type: String, required: true },
		},
	},
	{ timestamps: true }
);

////create model/////
const Location = mongoose.model('Location', locationSchema);

////export/////
module.exports = Location;
