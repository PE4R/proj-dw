const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const cookieParser = require('cookie-parser');

require('dotenv').config()

if (!process.env.JWT_SECRET || !process.env.DB_PASSWORD) {
    console.error('ERROR: Missing required environment variables.');
    process.exit(1); // Exit with a failure code
}

const app = express()
const port = process.env.PORT || 8000

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes)

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})