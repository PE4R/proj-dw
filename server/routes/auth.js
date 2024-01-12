const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { pool } = require('../db')
const authenticateToken = require ('../middleware/authenticateToken')

router.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: "You can see this secret message!" })
})

router.post('/register', async (req, res) =>{
    const { name, email, password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        //insert into db
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        )
        res.status(201).json(newUser.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/login', async (req, res) =>{
    const { email, password } = req.body
    try {
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )

        //check credentials
        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found"})
        }
        const isValid = await bcrypt.compare(password, user.rows[0].password)
        if (!isValid){
            return res.status(403).json({ error: "Invalid credentials"})
        }

        //if valid create and return JWT token
        const token = jwt.sign(
            { id: user.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        res.json({ token })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router;