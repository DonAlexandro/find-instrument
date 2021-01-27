const {Schema, model} = require('mongoose')

const tagSchema = new Schema({
	title: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
})

module.exports = model('Tag', tagSchema)
