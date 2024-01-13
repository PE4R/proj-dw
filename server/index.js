const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')

require('dotenv').config()

if (!process.env.JWT_SECRET || !process.env.DB_PASSWORD) {
    console.error('ERROR: Missing required environment variables.');
    process.exit(1); // Exit with a failure code
}

const app = express()
const port = process.env.PORT || 8000

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})