const {Router} = require('express')
const {validationResult} = require('express-validator')
const auth = require('../middleware/auth')
const {tagValidator} = require('../middleware/validators')
const Tag = require('../models/tag')
const router = Router()

router.post('/', auth, tagValidator, async (req, res) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) return

	try {
		const {title} = req.body

		const tag = new Tag({title, author: req.user.userId})

		await tag.save()

		res.json({tag})
	} catch (e) {
		res.status(500).json({message: 'Щось пішло не так, спробуйте заново пізніше'})
	}
})

router.get('/', auth, async (req, res) => {
	try {
		const tags = await Tag
			.find({author: req.user.userId})
			.sort({title: 'asc'})
			.lean()

		res.json({tags})
	} catch (e) {
		res.status(500).json({message: 'Щось пішло не так, спробуйте заново пізніше'})
	}
})

router.post('/remove', auth, async (req, res) => {
	try {
		await Tag.deleteOne({
			_id: req.body.id,
			author: req.user.userId
		})

		res.json({message: ''})
	} catch (e) {
		res.status(500).json({message: 'Щось пішло не так, спробуйте заново пізніше'})
	}
})

router.post('/update', auth, tagValidator, async (req, res) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) return

	try {
		const {id, title} = req.body

		const note = await Tag.findOne({
			_id: id,
			author: req.user.userId
		})

		Object.assign(note, {title})

		await note.save()

		res.json({message: ''})
	} catch (e) {
		res.status(500).json({message: 'Щось пішло не так, спробуйте заново пізніше'})
	}
})

module.exports = router
