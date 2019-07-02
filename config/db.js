const mongoose = require('mongoose');
// FUTURE: add this line
// const config = require('config');
// const db = config.get('mongoURI');
// FUTURE: remove these lines
const { mongoURI } = require('./keys');

const connectDB = async () => {
	try {
		await mongoose.connect(mongoURI, { useNewUrlParser: true });

		console.log('Mongo connected');
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

module.exports = connectDB;
