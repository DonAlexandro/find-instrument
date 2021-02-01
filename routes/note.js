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
		const {title, text, archived, note} = req.body

		const newNote = new Note({
			title, text,
			archived,
			author: req.user.userId,
			tags: note?.tags ? note.tags : [],
			color: note?.color && note.color
		})

		await newNote.save()

		res.status(201).json({message: archived && 'Нотатка додана в архів', note: newNote})
	} catch (e) {
		res.status(500).json({message: 'Щось пішло не так, спробуйте заново пізніше'})
	}
})

router.get('/', auth, async (req, res) => {
	try {
		const {location} = req.query

		const notes = await Note
			.find({
				author: req.user.userId,
				removed: false,
				archived: location === 'archive' ? true : false,
				removed: location === 'trash' ? true : false
 			})
			.sort({date: 'desc'})
			.populate('tags.tagId')
			.lean()

		res.json({notes})
	} catch (e) {
		res.status(500).json({message: 'Щось пішло не так, спробуйте заново пізніше'})
	}
})

router.post('/update', auth, async (req, res) => {
	try {
		const {color, archived, removed, tags} = req.body

		const note = await Note.findOne({
			_id: req.body.id,
			author: req.user.userId
		})

		const toChange = {
			color: color ? color : note.color,
			archived: archived !== undefined ? archived : note.archived,
			removed: removed !== undefined ? removed : note.removed,
			tags: tags ? tags : note.tags
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

router.post('/remove', auth, async (req, res) => {
	try {
		await Note.deleteOne({
			_id: req.body.id,
			author: req.user.userId
		})

		res.json({message: 'Замітку втрачено назавжди...'})
	} catch (e) {
		res.status(500).json({message: 'Щось пішло не так, спробуйте заново пізніше'})
	}
})

module.exports = router
