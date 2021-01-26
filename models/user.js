const {Schema, model} = require('mongoose')

const userSchema = new Schema({
	email: {
		required: true,
		type: String,
		unique: true
	},
	password: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true
	}
})

module.exports = model('User', userSchema)
