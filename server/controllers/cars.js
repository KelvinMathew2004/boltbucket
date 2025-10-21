const pool = require('../database.js');

const getAllCars = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cars ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error('Error fetching all cars:', error);
    }
};

const getCarById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('SELECT * FROM cars WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Car not found.');
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(`Error fetching car with ID ${id}:`, error);
    }
};

const createCar = async (req, res) => {
    const { make, model, year } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO cars (make, model, year) VALUES ($1, $2, $3) RETURNING *',
            [make, model, year]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error('Error creating a new car:', error);
    }
};

const updateCar = async (req, res) => {
    const id = parseInt(req.params.id);
    const { make, model, year } = req.body;
    try {
        const result = await pool.query(
            'UPDATE cars SET make = $1, model = $2, year = $3 WHERE id = $4 RETURNING *',
            [make, model, year, id]
        );
         if (result.rows.length === 0) {
            return res.status(404).send('Car not found, nothing updated.');
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(`Error updating car with ID ${id}:`, error);
    }
};

const deleteCar = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('DELETE FROM cars WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
             return res.status(404).send('Car not found, nothing deleted.');
        }
        res.status(200).send(`Car with ID: ${id} deleted successfully.`);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(`Error deleting car with ID ${id}:`, error);
    }
};

module.exports = {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
};