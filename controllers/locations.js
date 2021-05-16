const express = require('express');
const locations = express.Router();
const Location = require('../models/locations');

///////////////////////////////////////////////////////////////////////////////////

////// Create //////
locations.post('/', (req, res) => {
	Location.create(req.body, (err, createdLocation) => {
		if (err) {
			res.status(400).json({ message: 'post not successful ' + err });
		}
		if (createdLocation) {
			console.log(createdLocation);
			res.json(createdLocation);
		}
	});
});

////// Read //////
locations.get('/', (req, res) => {
	Location.find({}, (err, foundLocations) => {
		if (err) {
			res.status(400).json({ message: 'get not successful' });
		}
		if (foundLocations) {
			console.log(foundLocations);
			res.json(foundLocations);
		}
	});
});

////// Update //////
locations.put('/:id', (req, res) => {
	Location.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
		(err, updatedLocation) => {
			if (err) {
				res.status(400).json({ message: 'put not successful' });
			}
			if (updatedLocation) {
				console.log(updatedLocation);
				res.json(updatedLocation);
			}
		}
	);
});

////// Delete //////
locations.delete('/:id', (req, res) => {
	Location.findByIdAndRemove(req.params.id, (err, deletedLocation) => {
		if (err) {
			res.status(400).json({ message: 'delete not successful' });
		}
		if (deletedLocation) {
			console.log(deletedLocation);
			res.json(deletedLocation);
		}
	});
});

module.exports = locations;
