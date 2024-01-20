const express = require('express')
const { pool } = require('../db')
const authenticateToken = require('../middleware/authenticateToken')
const router = express.Router()

router.get('/all', async (req, res) => {
    try {
        const allUsers = await pool.query('SELECT id, name FROM users')
        res.json(allUsers.rows)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

module.exports = router