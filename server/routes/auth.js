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
        res.status(201).json({
            message: 'Registered',
            user: {
                id: newUser.rows[0].id,
                name: newUser.rows[0].name,
                email: newUser.rows[0].email,
                isadmin: false
            }
        })
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

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production',
        })
        
        res.status(200).json({
            message: 'Logged in',
            user: {
                id: user.rows[0].id,
                name: user.rows[0].name,
                email: user.rows[0].email,
                isadmin: user.rows[0].isadmin
            }
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0)
    })
    res.status(200).json({ message: 'Logged out' })
})

router.get('/checkSession', authenticateToken, async (req, res) => {
    const userId = req.user.id

    try {
        const user = await pool.query(
            'SELECT id, name, email, isadmin FROM users WHERE id = $1',
            [userId]
        )

        if (user.rows.length > 0) {
            const userInfo = user.rows[0]
            res.status(200).json({
                id: userInfo.id,
                name: userInfo.name,
                email: userInfo.email,
                isadmin: userInfo.isadmin
            })
        } else {
            res.status(404).send('User not found')
        }
    } catch (err) {
        console.error(err)
        res.status(500).send('Server error')
    }
})

module.exports = router