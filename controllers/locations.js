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

//get location by center radius
locations.get('/store', (req, res) => {
	Location.aggregate([
		{
			$geoNear: {
				near: { type: 'Point', coordinates: req.body },
				distanceField: 'dist.calculated',
				maxDistance: 800,
				//  query: { category: "Parks" },
				includeLocs: 'dist.location',
				spherical: true,
			},
		},
	])
		.then((data) => {
			console.log(req.body);
			console.log(data);
			res.json(data);
		})
		.catch((err) =>
			res.status(400).json({ message: 'get not successful ' + err })
		);
});

//get all locations
locations.get('/', (req, res) => {
	Location.find({}, (err, foundLocations) => {
		if (err) {
			res.status(400).json({ message: 'get not successful ' + err });
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
