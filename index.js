// Basic modules
const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');

// Loading mongoose schemas
require('./models/User');
require('./models/Profile');

// Loading routes

// Connecting DB
try {
	mongoose
		.connect(keys.mongoURI, {
			useNewUrlParser: true,
			useCreateIndex: true
		})
		.then(console.log('Mongo connected'));
} catch (err) {
	console.error('ERROR ON MONGOOSE CONNECTION: ', err.message);
	process.exit(1);
}

// Starting app
const app = express();

// Body parsing middleware
app.use(express.json({ extended: false }));

// Using routes
app.get('/', (req, res) => res.send('Hello World! ...'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));

if (process.env.NODE_ENV === 'production') {
	// Express serves production assets (main.css)
	app.use(express.static('client/build'));

	// Express serves index.html if doesn't recognize route
	const path = require('path');
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App running on port ${PORT}`));
