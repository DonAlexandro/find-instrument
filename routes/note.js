const {Router} = require('express')
const {validationResult} = require('express-validator')
const {noteValidator} = require('../middleware/validators')
const auth = require('../middleware/auth')
const Note = require('../models/note')
const router = Router()

router.post('/', auth, noteValidator, async (req, res) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return
	}

	try {
		const {title, text, archived} = req.body

		const note = new Note({
			title, text,
			archived,
			author: req.user.userId
		})

		await note.save()


		res.status(201).json({message: archived && 'Нотатка додана в архів', note})
	} catch (e) {
		res.status(500).json({message: 'Щось пішло не так, спробуйте заново пізніше'})
	}
})

router.get('/', auth, async (req, res) => {
	try {
		const notes = await Note
			.find({
				author: req.user.userId,
				removed: false,
				archived: false
			})
			.sort({date: 'desc'})
			.lean()

		res.json({notes})
	} catch (e) {
		res.status(500).json({message: 'Щось пішло не так, спробуйте заново пізніше'})
	}
})

router.post('/update', auth, async (req, res) => {
	try {
		const {color, archived, removed} = req.body

		const note = await Note.findOne({
			_id: req.body.id,
			author: req.user.userId
		})

		const toChange = {
			color: color ? color : note.color,
			archived: archived ? archived : note.archived,
			removed: removed ? removed : note.removed
		}

		Object.assign(note, toChange)

		await note.save()

		if (archived) {
			res.json({message: 'Нотатка переміщена в архів'})
		} else if (removed) {
			res.json({message: 'Нотатка переміщена в корзину'})
		} else {
			res.json({message: ''})
		}
	} catch (e) {
		res.status(500).json({message: 'Щось пішло не так, спробуйте заново пізніше'})
	}
})

module.exports = router
