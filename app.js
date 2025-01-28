const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const routes = require('./config/routes')
const configureDB = require('./config/database')

const app = express()
configureDB()
dotenv.config()
app.use(cors())
app.use(express.json())
app.use('/api', routes)
const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log('Server listening to port:', port)
})