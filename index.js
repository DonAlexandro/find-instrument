const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const helmet = require('helmet')
const compression = require('compression')

const app = express()

app.use(express.json({extended: true}))

app.use(helmet())
app.use(compression())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/note'))
app.use('/api/tags', require('./routes/tag'))

const PORT = config.get('port') || 5000

async function start () {
	try {
		await mongoose.connect(config.get('mongoUri'), {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true
		})

		app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
	} catch (e) {
		console.error('[Server Error]', e)
		process.exit(1)
	}
}

start()
