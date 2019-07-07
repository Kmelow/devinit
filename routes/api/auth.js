const express = require('express');
const router = express.Router();
const authMW = require('../../middlware/auth');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const User = require('../../models/User');

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

// @route 	POST api/auth
// @desc		Authenticate user and get token
// @access	Public
router.post(
	'/',
	[ check('email', 'Please include a valid e-mail').isEmail(), check('password', 'Password required').exists() ],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;

		try {
			// Check if user already
			let user = await User.findOne({ email });
			if (!user) {
				return res.status(400).json({ errors: [ { msg: 'Invalid credentials' } ] });
			}

			// Decrypt password (bcrypt)
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ errors: [ { msg: 'Invalid credentials' } ] });
			}

			// Payload and token signin
			const payload = {
				user: {
					id: user.id
				}
			};

			jwt.sign(payload, keys.jwtSecret, { expiresIn: 360000 }, (err, token) => {
				if (err) throw err;
				res.json({ token });
			});
		} catch (err) {
			console.error('FAILLED TO SIGN USER: ', err.message);
			res.status(500).send('Server error');
		}
	}
);

module.exports = router;
