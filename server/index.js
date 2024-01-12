const express = require('express')
require('dotenv').config()
const cors = require('cors')

const app = express()
const port = 8000
const authRoutes = require('./routes/auth')

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)

app.listen(port, () => console.log(`server running on port ${port}`))