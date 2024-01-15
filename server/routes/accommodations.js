const express = require('express')
const { pool } = require('../db')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const allAccommodations = await pool.query(
            'SELECT * FROM accommodations'
        )
        res.json(allAccommodations.rows)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const accommodation = await pool.query(
            'SELECT * FROM accommodations WHERE id = $1',
            [id]
        )
        if (accommodation.rows.length === 0) {
            return res.status(404).send('Accommodation not found')
        }
        res.json(accommodation.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

router.post('/', async (req, res) => {
    const { name, description, imageUrl, latitude, longitude } = req.body

    if (!name) {
        return res.status(400).json({ error: 'Name required.' })
    }

    try {
        const newAccommodation = await pool.query(
            'INSERT INTO accommodations (name, description, image_url, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, description, imageUrl, latitude, longitude]
        )
        res.json(newAccommodation.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { name, description, imageUrl, latitude, longitude } = req.body

    if (!name) {
        return res.status(400).json({ error: 'Name required.' })
    }

    try {
        const updateAccommodation = await pool.query(
            'UPDATE accommodations SET name = $1, description = $2, image_url = $3, latitude = $4, longitude = $5 WHERE id = $6 RETURNING *',
            [name, description, imageUrl, latitude, longitude, id]
        )
        if (updateAccommodation.rows.length === 0){
            return res.status(404).send('Accommodation not found')
        }
        res.json(updateAccommodation.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')        
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deleteAccommodation = await pool.query(
            'DELETE FROM accommodations WHERE id = $1 RETURNING *',
            [id]
        )

        if (deleteAccommodation.rowCount === 0) {
            return res.status(404).send('Accommodation not found')
        }

        res.json({ message: 'Accommodation deleted successfully'})
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

module.exports = router