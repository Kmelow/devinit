module.exports = {
	mongoURI: process.env.MONGO_URI_MLAB,
	// mongoURI: process.env.MONGO_URI,
	jwtSecret: process.env.JWT_SECRET_TOKEN,
	githubClientID: process.env.GITHUB_CLIENT_ID,
	githubClientSecret: process.env.GITHUB_SECRET
};
