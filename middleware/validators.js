const {body} = require('express-validator')
const bcrypt = require('bcrypt')
const User = require('../models/user')

exports.signupValidator = [
	body('email')
		.not().isEmpty().withMessage('Введіть, будь ласка, Email')
		.isEmail().withMessage('Введіть коректний Email')
		.normalizeEmail()
		.trim()
		.custom(async value => {
			const candidate = await User.findOne({email: value})

			if (candidate) {
				return Promise.reject('Користувач з таким Email-ом вже зареєстрований')
			}
		}),
	body('username')
		.isLength({min: 4}).withMessage('Мінімальна довжина псевдоніму - 4 символи')
		.trim(),
	body('password')
		.isLength({min: 8}).withMessage('Мінімальна довжина паролю - 8 символів')
		.isAlphanumeric()
		.trim(),
	body('confirm')
		.custom((value, {req}) => {
			if (value !== req.body.password) {
				throw new Error('Паролі не співпадають')
			}

			return true
		})
]

exports.loginValidator = [
	body('email')
		.not().isEmpty().withMessage('Введіть, будь ласка, Email')
		.isEmail().withMessage('Введіть коректний Email')
		.normalizeEmail()
		.trim()
		.custom(async value => {
			const candidate = await User.findOne({email: value})

			if (!candidate) {
				return Promise.reject('Користувач з таким Email-ом не зареєстрований')
			}
		}),
	body('password')
		.isLength({min: 8}).withMessage('Мінімальна довжина паролю - 8 символів')
		.isAlphanumeric()
		.trim()
		.custom(async (value, {req}) => {
			const user = await User.findOne({email: req.body.email})

			const isSame = await bcrypt.compare(value, user.password)

			if (!isSame) {
				return Promise.reject('Невірний пароль')
			}
		})
]

exports.noteValidator = [
	body('title')
		.custom((value, {req}) => {
			if (!req.body.text.length && !value.length) {
				return false
			}

			return true
		}),
	body('text')
		.custom((value, {req}) => {
			if (!req.body.title.length && !value.length) {
				return false
			}

			return true
		})
]
