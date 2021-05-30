const express = require('express');
const foods = express.Router();
const Middleware = require('../middlewares');
const Food = require('../models/foods');
///////////////////////////////////////////////////////////////////////////////////

////// Create //////

//create comment
foods.post('/:id/comment', Middleware.checkAuth, (req, res) => {
	Food.findById(req.params.id)
		.then((store) => {
			let food = store.menu.id(req.query.food);
			food.comments.push(req.body);
			return store.save().then((savedDoc) => savedDoc);
		})
		.then((data) => {
			console.log(data);
			res.json(data);
		})
		.catch((err) =>
			res.status(400).json({ message: 'post not successful ' + err })
		);
});

//create food
foods.post('/:id/menu', Middleware.checkAuth, (req, res) => {
	Food.findById(req.params.id)
		.then((store) => {
			store.menu.push(req.body);
			return store.save().then((savedDoc) => savedDoc);
		})
		.then((data) => {
			console.log(data);
			res.json(data);
		})
		.catch((err) =>
			res.status(400).json({ message: 'post not successful ' + err })
		);
});

//create store
foods.post('/', Middleware.checkAuth, (req, res) => {
	Food.create(req.body, (err, createdFood) => {
		if (err) {
			res.status(400).json({ message: 'post not successful ' + err });
		}
		if (createdFood) {
			console.log(createdFood);
			res.json(createdFood);
		}
	});
});

////// Read //////

//get store by query params
foods.get('/store', (req, res) => {
	Food.find(req.query, (err, foundFood) => {
		if (err) {
			res.status(400).json({ message: 'get not successful ' + err });
		}
		if (foundFood) {
			console.log(foundFood);
			res.json(foundFood);
		}
	});
});

//get store by id
foods.get('/:id', (req, res) => {
	Food.findById(req.params.id, (err, foundFood) => {
		if (err) {
			res.status(400).json({ message: 'get not successful ' + err });
		}
		if (foundFood) {
			console.log(foundFood);
			res.json(foundFood);
		}
	});
});

//get all stores
foods.get('/', (req, res) => {
	Food.find({}, (err, foundFoods) => {
		if (err) {
			res.status(400).json({ message: 'get not successful ' + err });
		}
		if (foundFoods) {
			console.log(foundFoods);
			res.json(foundFoods);
		}
	});
});

////// Update //////
foods.put('/:id', Middleware.checkAuth, (req, res) => {
	// Find document as usual
	Food.findById(req.params.id)
		//use the returned document to find sub-documents by using .id()
		.then((store) => {
			let food = null;
			let comment = null;
			// if there is query params for food, need to find the sub-document for menu array
			if (req.query.food) {
				food = store.menu.id(req.query.food);
				// if there is query params for comment also, means need update comment level sub-documents so
				// also need to find the sub-document for comments array
				if (req.query.comment) {
					comment = food.comments.id(req.query.comment);
					comment.set(req.body);
					// if no query params for comment, means update food level sub-document only
				} else {
					food.set(req.body);
				}
				// if no query params for food/comment, means just need to update top-level document
			} else {
				store.set(req.body);
			}
			// saves document with sub-documents and triggers validation
			return store.save().then((savedDoc) => {
				return comment || food || savedDoc;
			});
		})
		.then((data) => {
			console.log(data);
			res.json(data);
		})
		.catch((err) =>
			res.status(400).json({ message: 'put not successful ' + err })
		);
});

////// Delete //////

//delete comment
foods.delete('/:id/comment', Middleware.checkAuth, (req, res) => {
	Food.findById(req.params.id)
		.then((store) => {
			let food = store.menu.id(req.query.food);
			food.comments.id(req.query.comment).remove();
			return store.save().then((savedDoc) => savedDoc);
		})
		.then((data) => {
			console.log(data);
			res.json(data);
		})
		.catch((err) =>
			res.status(400).json({ message: 'delete not successful ' + err })
		);
});

//delete food
foods.delete('/:id/menu', Middleware.checkAuth, (req, res) => {
	Food.findByIdAndUpdate(
		req.params.id,
		{
			$pull: {
				menu: { _id: req.query.food },
			},
		},
		{ new: true },
		(err, deletedFood) => {
			if (err) {
				res.status(400).json({
					message: 'delete not successful ' + err,
				});
			}
			if (deletedFood) {
				console.log(deletedFood);
				res.json(deletedFood);
			}
		}
	);
});

//delete store
foods.delete('/:id', Middleware.checkAuth, (req, res) => {
	Food.findByIdAndRemove(req.params.id, (err, deletedStore) => {
		if (err) {
			res.status(400).json({ message: 'delete not successful ' + err });
		}
		if (deletedStore) {
			console.log(deletedStore);
			res.json(deletedStore);
		}
	});
});

module.exports = foods;

///////////////////////////////////////////////////////////////////////////////////
