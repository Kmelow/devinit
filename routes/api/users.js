const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = mongoose.model('users');

// @route 	POST api/users
// @desc		Register user
// @access	Public
router.post(
	'/',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Please include a valid e-mail').isEmail(),
		check('password', 'Password must have more than 5 characters').isLength({ min: 6 })
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, email, password } = req.body;

		try {
			// Check if user already exists
			let user = await User.findOne({ email });
			if (user) {
				return res.status(400).json({ errors: [ { msg: 'User already exists' } ] });
			}

			// Fetch user's gravatar
			const avatar = gravatar.url(email, {
				s: '200',
				r: 'pg',
				d: 'mm'
			});

			// Create user instance
			user = new User({
				name,
				email,
				avatar,
				password
			});

			// Encrypt password (bcrypt)
			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);

			await user.save();

			// Return JWT

			console.log(req.body);
			res.send('User registered');
		} catch (err) {
			console.error('FAILLED TO SIGN USER: ', err.message);
			res.status(500).send('Server error');
		}
	}
);

module.exports = router;
