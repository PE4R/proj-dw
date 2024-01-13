const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { pool } = require('../db')
const authenticateToken = require ('../middleware/authenticateToken')

const router = express.Router()

router.post('/register', async (req, res) =>{
    const { name, email, password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        )
        res.status(201).json(newUser.rows[0])
    } catch (err) {
        console.error(err)
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

        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found"})
        }

        const isValid = await bcrypt.compare(password, user.rows[0].password)
        if (!isValid){
            return res.status(403).json({ error: "Invalid credentials"})
        }

        const token = jwt.sign(
            { id: user.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        res.json({ token })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

module.exports = router