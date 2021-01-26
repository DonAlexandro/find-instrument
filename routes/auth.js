const {Router} = require('express')
const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const {signupValidator, loginValidator} = require('../middleware/validators')
const User = require('../models/user')
const router = Router()

router.post('/signup', signupValidator, async (req, res) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(400).json({message: errors.array()[0].msg})
	}

	try {
		const {email, password, username} = req.body

		const hashedPassword = await bcrypt.hash(password, 12)

		const user = new User({email, password: hashedPassword, username})

		await user.save()

		res.status(201).json({message: 'Ви успішно зареєструвалися!'})
	} catch (e) {
		res.status(500).json({message: 'Щось пішло не так, спробуйте заново пізніше'})
	}
})

router.post('/login', loginValidator, async (req, res) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(400).json({message: errors.array()[0].msg})
	}

	try {
		const {email} = req.body

		const user = await User.findOne({email})
		const userId = user._id

		const token = jwt.sign({userId}, config.get('jwtSecret'), {expiresIn: '1h'})

		res.json({message: 'Вітаємо!', token, userId})
	} catch (e) {
		res.status(500).json({message: 'Щось пішло не так, спробуйте заново пізніше'})
	}
})

module.exports = router
