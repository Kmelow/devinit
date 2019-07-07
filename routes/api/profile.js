const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const authMW = require('../../middlware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route 	GET api/profile/me
// @desc		Get current's user profile
// @access	Private
router.get('/me', authMW, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id
		}).populate('user', ['name', 'avatar']);

		if (!profile) {
			return res.status(400).json({ msg: 'No profile for this user' });
		}

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).setDefaultEncoding('Error on fetching profile');
	}
});

// @route 	POST api/profile
// @desc		Create or update users's profile
// @access	Private
router.post(
	'/',
	[
		authMW,
		[
			check('status', 'Status is required')
				.not()
				.isEmpty(),
			check('skills', 'Skills is required')
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).send({ errors: errors.array() });
		}

		const {
			company,
			website,
			location,
			bio,
			status,
			githubusername,
			skills,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin
		} = req.body;

		// Build profile object
		const profileFields = {};
		profileFields.user = req.user.id;
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (bio) profileFields.bio = bio;
		if (status) profileFields.status = status;
		if (githubusername) profileFields.githubusername = githubusername;
		if (skills) {
			profileFields.skills = skills.split(',').map(skill => skill.trim());
		}

		// Build social object
		profileFields.social = {};
		if (youtube) profileFields.social.youtube = youtube;
		if (twitter) profileFields.social.twitter = twitter;
		if (facebook) profileFields.social.facebook = facebook;
		if (linkedin) profileFields.social.linkedin = linkedin;
		if (instagram) profileFields.social.instagram = instagram;

		try {
			let profile = await Profile.findOne({ user: req.user.id });
			if (profile) {
				// Update
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				);

				return res.json(profile);
			}

			// Create
			profile = new Profile(profileFields);
			await profile.save();
			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send(' Error with fetching profile ');
		}
	}
);

// @route 	GET api/profile
// @desc		Get all profiles
// @access	Public
router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', ['name', 'avatar']);
		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Error fetching profiles');
	}
});

// @route 	GET api/profile/user/:user_id
// @desc		Get profile by user id
// @access	Public
router.get('/user/:user_id', async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id
		}).populate('user', ['name', 'avatar']);

		if (!profile) {
			return res.status(400).json({ msg: 'Profile not found' });
		}

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(400).json({ msg: 'Profile not found' });
		}

		res.status(500).send('Error fetching profiles');
	}
});

// @route 	DELETE api/profile/
// @desc		Delete profile, user and posts
// @access	Private
router.delete('/', authMW, async (req, res) => {
	try {
		// Remove profile
		await Profile.findOneAndRemove({ user: req.user.id });
		// Remove user
		await User.findOneAndRemove({ _id: req.user.id });
		// TODO: remove user's posts

		res.json({ msg: 'User deleted' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Error fetching profile');
	}
});

// @route 	PUT api/profile/experience
// @desc		Add profile experience
// @access	Private
router.put(
	'/experience',
	[
		authMW,
		[
			check('title', 'Title is required')
				.not()
				.isEmpty(),
			check('company', 'Company is required')
				.not()
				.isEmpty(),
			check('from', 'Start date is required')
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			title,
			company,
			location,
			from,
			to,
			current,
			description
		} = req.body;

		const newXp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });
			profile.experience.unshift(newXp);
			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).json('Error adding experience');
		}
	}
);

// @route 	DELETE api/profile/experience/:xp_id
// @desc		Delete profile experience
// @access	Private
router.delete('/experience/:xp_id', authMW, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		const removeIndex = profile.experience
			.map(item => item.id)
			.indexOf(req.params.xp_id);

		profile.experience.splice(removeIndex, 1);

		await profile.save();

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).json('Error adding experience');
	}
});

module.exports = router;
