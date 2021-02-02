const {Schema, model} = require('mongoose')

const noteSchema = new Schema({
	title: String,
	text: String,
	list: [
		{
			title: String,
			done: {
				type: Boolean,
				default: false
			}
		}
	],
	color: {
		type: String,
		default: 'bg-dark'
	},
	archived: {
		type: Boolean,
		default: false
	},
	removed: {
		type: Boolean,
		default: false
	},
	pinned: {
		type: Boolean,
		default: false
	},
	tags: [
		{
			tagId: {
				type: Schema.Types.ObjectId,
				ref: 'Tag'
			}
		}
	],
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	date: {
		type: Date,
		required: true,
		default: Date.now
	}
})

module.exports = model('Note', noteSchema)
