/////////////// Dependencies /////////////
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

/////////////// Environment Variables ///////////////
const port = process.env.PORT || 3001;
const mongoURI = process.env.DB_URI || 'mongodb://localhost:27017/goodfood';

const app = express();
const db = mongoose.connection;

/////////////// Connect to mongoose /////////////
mongoose.connect(
	mongoURI,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => console.log(`MongoDB connection established: ${mongoURI}`)
);

/////////////// Error / Disconnection /////////////
db.on('error', (err) => console.log(err.message));
db.on('disconnected', () => console.log('mongo disconnected'));

/////////////// Middleware /////////////
app.use(express.urlencoded({ extended: false })); // extended: false - does not allow nested objects in query strings
app.use(express.json()); // returns middleware that only parses JSON

// Test route
app.get('/', (req, res) => {
	res.send('backend is working...');
});

// Catch route that does not exists
app.get('*', (req, res) => {
	res.status(404).json('I dont have that, page not found...');
});

app.listen(port, () =>
	console.log(`Listening at port: ${port} and mongoURI: ${mongoURI}`)
);
