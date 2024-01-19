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

router.get('/:id', async (req, res) => {
    const { id } = req.params
})

router.post('/', authenticateToken, async (req, res) => {
    const { accommodation_id, start_date, end_date } = req.body

    if (!accommodation_id || !start_date || !end_date) {
        return res.status(400).json({ error: 'All fields are required'})
    }

    if (new Date(start_date) >= new Date(end_date)){
        return res.status(400).json({ error: 'End date must be after start date' })
    }

    try {
        const existingReservations = await pool.query(
            'SELECT * FROM reservations WHERE accommodation_id = $1 AND NOT (end_date <= $2 OR start_date >= $3)',
            [accommodation_id, start_date, end_date]
        )

        if(existingReservations.rows.length > 0) {
            return res.status(400).json({ error: 'Selected dates are already booked' })
        }

        const newReservation = await pool.query(
            'INSERT INTO reservations (user_id, accommodation_id, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, accommodation_id, start_date, end_date, 'pending']
        )

        res.json(newReservation.rows[0])

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }

})

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params
    const { accommodation_id, start_date, end_date, status } = req.body

    try {
        const updatedReservation = await pool.query(
            'UPDATE reservations SET accommodation_id = $1, start_date = $2, end_date = $3, status = $4 WHERE id = $5 RETURNING *',
            [accommodation_id, start_date, end_date, status, id]
        )

        if (updatedReservation.rows.length === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        res.json(updatedReservation.rows[0])
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

        res.json({ message: 'Reservation deleted successfully' });
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

module.exports = router