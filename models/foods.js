const mongoose = require('mongoose');

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
