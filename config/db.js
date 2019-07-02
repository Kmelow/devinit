const mongoose = require('mongoose');
// FUTURE: add this line
// const config = require('config');
// const db = config.get('mongoURI');
// FUTURE: remove these lines
const keys = require('./keys');
const db = keys.mongoURI;

const connectDB = async () => {
	try {
		await mongoose.connect(db, { useNewUrlParser: true });

		console.log('Mongo connected (config)');
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

module.exports = connectDB;
