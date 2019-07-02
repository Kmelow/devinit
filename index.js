// Basic modules
const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');

// Loading mongoose schemas
require('./models/User');

// Loading routes

// Connecting to database
mongoose
	.connect(keys.mongoURI, { useNewUrlParser: true })
	.then(console.log('Mongo connected'))
	.catch((err) => console.log(err));

// Starting app
const app = express();

// Using routes
app.get('/', (req, res) => res.send('Hello World! ...'));
// require('./routes/...')(app);

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
