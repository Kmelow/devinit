const express = require('express');
const router = express.Router();
const authMW = require('../../middlware/auth');
const mongoose = require('mongoose');

const User = mongoose.model('users');

// @route 	GET api/auth
// @desc		Test route
// @access	Public
router.get('/', authMW, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send(`Couldn't fetch user`);
	}
});

module.exports = router;
