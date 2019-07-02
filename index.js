// Basic modules
const express = require('express');
const connectDB = require('./config/db');

// Loading mongoose schemas
// require('./models/User');

// Loading routes

// Connecting DB
connectDB();

// Starting app
const app = express();

// Using routes
app.get('/', (req, res) => res.send('Hello World! ...'));
// app.use('/api/auth', require('./routes/api/auth'));
// app.use('/api/posts', require('./routes/api/posts'));
// app.use('/api/profile', require('./routes/api/profile'));
// app.use('/api/users', require('./routes/api/users'));
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
