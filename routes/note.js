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
		const {title, text, archived, note, list} = req.body

		const newNote = new Note({
			title, archived,
			text: text && text,
			list: list && list,
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

		const {color, archived, removed, tags, pinned, title, text, list} = req.body

		const note = await Note.findOne({
			_id: req.body.id,
			author: req.user.userId
		})

		const toChange = {
			title: title ? title : note.title,
			text: text ? text : note.text,
			color: color ? color : note.color,
			archived: archived !== undefined ? archived : note.archived,
			removed: removed !== undefined ? removed : note.removed,
			tags: tags ? tags : note.tags,
			pinned: pinned !== undefined ? pinned : note.pinned,
			list: list ? list : note.list
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
		console.log(e)
		res.status(500).json({message: 'Щось пішло не так, спробуйте заново пізніше'})
	}
})

router.post('/remove', auth, async (req, res) => {
	try {
		const {id} = req.body

		if (id) {
			await Note.deleteOne({
				_id: id,
				author: req.user.userId
			})

			return res.json({message: 'Замітку втрачено назавжди...'})
		} else {
			await Note.deleteMany({
				removed: true,
				author: req.user.userId
			})

			return res.json({message: 'Корзина очищена'})
		}
	} catch (e) {
		console.log(e)
		res.status(500).json({message: 'Щось пішло не так, спробуйте заново пізніше'})
	}
})

router.get('/tag/:id', auth, async (req, res) => {
	try {
		if (req.params.id) {
			const notes = await Note
				.find({
					author: req.user.userId,
					removed: false
				})
				.sort({date: 'desc'})
				.populate('tags.tagId')
				.lean()

			const notesByTag = notes.filter(note => {
				const isNoteHasTag = note.tags.some(tag => tag.tagId._id.toString() === req.params.id.toString())

				if (isNoteHasTag) {
					return note
				}
			})

			res.json({notes: notesByTag})
		}

	} catch (e) {
		console.error(e)
		res.status(500).json({message: 'Щось пішло не так, спробуйте заново пізніше'})
	}
})

module.exports = router
