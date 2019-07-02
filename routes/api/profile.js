const express = require('express');
const router = express.Router();
const authMW = require('../../middlware/auth');
const mongoose = require('mongoose');

const Profile = mongoose.model('profile');
const User = mongoose.model('users');

// @route 	GET api/profile/me
// @desc		Get current's user profile
// @access	Private
router.get('/me', authMW, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate('users', [ 'name', 'avatar' ]);

		if (!profile) {
			return res.status(400).json({ msg: 'No profile for this user' });
		}

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).setDefaultEncoding('Error on fetching profile');
	}
});

module.exports = router;
