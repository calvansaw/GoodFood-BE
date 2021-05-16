const bcrypt = require('bcrypt');
const express = require('express');
const users = express.Router();
const User = require('../models/users');

///////////////////////////////////////////////////////////////////////////////////

////// Create //////
users.post('/', (req, res) => {
	req.body.password = bcrypt.hashSync(
		req.body.password,
		bcrypt.genSaltSync(10)
	);
	User.create(req.body, (err, createdUser) => {
		if (err) {
			res.status(400).json({ message: 'post not successful ' + err });
		}
		if (createdUser) {
			console.log(createdUser);
			res.json(createdUser);
		}
	});
});

////// Read //////
users.get('/', (req, res) => {
	User.find({}, (err, foundUsers) => {
		if (err) {
			res.status(400).json({ message: 'get not successful' });
		}
		if (foundUsers) {
			console.log(foundUsers);
			res.json(foundUsers);
		}
	});
});

////// Update //////
users.put('/:id', (req, res) => {
	User.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
		(err, updatedUser) => {
			if (err) {
				res.status(400).json({ message: 'put not successful' });
			}
			if (updatedUser) {
				console.log(updatedUser);
				res.json(updatedUser);
			}
		}
	);
});

////// Delete //////
users.delete('/:id', (req, res) => {
	User.findByIdAndRemove(req.params.id, (err, deletedUser) => {
		if (err) {
			res.status(400).json({ message: 'delete not successful' });
		}
		if (deletedUser) {
			console.log(deletedUser);
			res.json(deletedUser);
		}
	});
});

module.exports = users;
