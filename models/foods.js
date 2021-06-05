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
		username: { type: String, required: true },
		comment: { type: String, required: true },
	},
	{ timestamps: true }
);

const menuSchema = new mongoose.Schema({
	foodName: { type: String, required: true },
	foodDesc: String,
	foodImg: String,
	price: { type: Number, required: true },
	comments: { type: [commentSchema] },
});

////create schema//////
const storeSchema = new mongoose.Schema(
	{
		storeName: { type: String, required: true, unique: true },
		storeDesc: String,
		storeImg: String,
		storeAvatar: String,
		username: { type: String, required: true },
		menu: { type: [menuSchema] },
	},
	{ timestamps: true }
);

////create model/////
const Food = mongoose.model('Food', storeSchema);

////export/////
module.exports = Food;
