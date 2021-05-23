const mongoose = require('mongoose');

////create schema//////
const pointSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ['Point'],
		required: true,
	},
	coordinates: {
		type: [Number],
		required: true,
	},
});

const locationSchema = new mongoose.Schema(
	{
		storeName: { type: String, required: true, unique: true },
		location: {
			type: pointSchema,
			index: '2dsphere',
			required: true,
		},
		address: { type: String, required: true, unique: true },
		username: { type: String, required: true },
	},
	{ timestamps: true }
);

////create model/////
const Location = mongoose.model('Location', locationSchema);

////export/////
module.exports = Location;
