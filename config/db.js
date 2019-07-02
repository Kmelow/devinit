const mongoose = require('mongoose');
// FUTURE: add this line
// const config = require('config');
// const db = config.get('mongoURI');
// FUTURE: remove these lines
const keys = require('./keys');
// const db = keys.mongoURI;

const connectDB = async () => {
	try {
		await mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

		console.log('Mongo connected');
	} catch (err) {
		console.error('ERROR ON MONGO CONNECTION: ', err);
		process.exit(1);
	}
};

module.exports = connectDB;
