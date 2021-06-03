const express = require('express');
const locations = express.Router();
const Middleware = require('../middlewares');
const Location = require('../models/locations');

///////////////////////////////////////////////////////////////////////////////////

////// Create //////
locations.post('/', Middleware.checkAuth, (req, res) => {
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
	const { lat, lng, dist } = req.query;
	const longitude = Number(lng);
	const latitude = Number(lat);
	const distance = Number(dist);
	let coordArray = [longitude, latitude];
	console.log(coordArray);
	console.log(distance);
	Location.aggregate([
		{
			$geoNear: {
				near: { type: 'Point', coordinates: coordArray },
				distanceField: 'dist.calculated',
				maxDistance: distance,
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
locations.put('/:id', Middleware.checkAuth, (req, res) => {
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
locations.delete('/:id', Middleware.checkAuth, (req, res) => {
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
