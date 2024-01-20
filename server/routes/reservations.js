const express = require('express')
const { pool } = require('../db')
const authenticateToken = require('../middleware/authenticateToken')
const router = express.Router()

router.get('/my', authenticateToken, async (req, res) => {
    try {
        const userReservations = await pool.query(
            'SELECT reservations.*, accommodations.name AS accommodation_name, users.name AS user_name ' +
            'FROM reservations ' +
            'INNER JOIN accommodations ON reservations.accommodation_id = accommodations.id ' +
            'INNER JOIN users ON reservations.user_id = users.id ' +
            'WHERE reservations.user_id = $1',
            [req.user.id]
        )
        res.json(userReservations.rows)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

router.get('/all', authenticateToken, async (req, res) => {
    const adminCheckResult = await pool.query(
        'SELECT isadmin FROM users WHERE id = $1',
        [req.user.id]
    )

    if (adminCheckResult.rows.length === 0 || !adminCheckResult.rows[0].isadmin) {
        return res.status(403).send('Access denied')
    }

    try {
        const allReservations = await pool.query(
            'SELECT reservations.*, accommodations.name AS accommodation_name, users.name AS user_name ' +
            'FROM reservations ' +
            'INNER JOIN accommodations ON reservations.accommodation_id = accommodations.id ' +
            'INNER JOIN users ON reservations.user_id = users.id'
        )
        res.json(allReservations.rows)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
})

router.post('/', authenticateToken, async (req, res) => {
    const { userId, accommodationId, startDate, endDate, status } = req.body

    if (!accommodationId || !startDate || !endDate) {
        return res.status(400).json({ error: 'All fields are required'})
    }

    if (new Date(startDate) >= new Date(endDate)){
        return res.status(400).json({ error: 'End date must be after start date' })
    }

    try {
        const existingReservations = await pool.query(
            'SELECT * FROM reservations WHERE accommodation_id = $1 AND NOT (end_date <= $2 OR start_date >= $3)',
            [accommodationId, startDate, endDate]
        )

        if(existingReservations.rows.length > 0) {
            return res.status(400).json({ error: 'Selected dates are already booked' })
        }

        const newReservation = await pool.query(
            'INSERT INTO reservations (user_id, accommodation_id, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, accommodationId, startDate, endDate, status]
        )

        res.json(newReservation.rows[0])

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }

})

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params
    const { userId, accommodationId, startDate, endDate, status } = req.body

    try {
        const updatedReservation = await pool.query(
            'UPDATE reservations SET user_id = $1, accommodation_id = $2, start_date = $3, end_date = $4, status = $5 WHERE id = $6 RETURNING *',
            [userId, accommodationId, startDate, endDate, status, id]
        )

        if (updatedReservation.rows.length === 0) {
            return res.status(404).json({ error: 'Reservation not found' })
        }

        res.json(updatedReservation.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

router.patch('/updateStatus/:id', authenticateToken, async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    try {
        const updateResult = await pool.query(
            'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        )

        if (updateResult.rows.length === 0) {
            return res.status(404).json({ error: 'Reservation not found' })
        }

        res.json(updateResult.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params

    try {
        const deletedReservation = await pool.query(
            'DELETE FROM reservations WHERE id = $1 RETURNING *',
            [id]
        )

        if (deletedReservation.rowCount === 0) {
            return res.status(404).json({ error: 'Reservation not found' })
        }

        res.json({ message: 'Reservation deleted successfully' })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

module.exports = router