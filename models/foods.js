const mongoose = require('mongoose');

// // Validators always receive the value to validate as their first argument and must return Boolean. Returning false means validation failed.
// const validator = (val) => {
// 	return val === 'owner' || val === 'public';
// };

// // Create custom validation error msg, {PATH} refers to the property name
// const custom = [validator, 'Uh oh, {PATH} does not equal owner or public.'];

const commentSchema = new mongoose.Schema(
	{
		name: { type: String, default: 'Anonymous' },
		comment: { type: String, required: true },
	},
	{ timestamps: true }
);

const menuSchema = new mongoose.Schema({
	foodName: { type: String, required: true },
	price: { type: Number, required: true },
	comments: { type: [commentSchema], default: undefined },
});

////create schema//////
const foodSchema = new mongoose.Schema(
	{
		storeName: { type: String, required: true },
		menu: { type: [menuSchema], required: true },
	},
	{ timestamps: true }
);

////create model/////
const Food = mongoose.model('Food', foodSchema);

////export/////
module.exports = Food;