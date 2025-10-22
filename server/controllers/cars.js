import { pool } from '../config/database.js';

const BASE_PRICE = 65000;

const getPriceFromDB = async (category, name) => {
    try {
        const result = await pool.query(
            'SELECT price FROM options WHERE category = $1 AND name = $2',
            [category, name]
        );
        return result.rows[0]?.price || 0;
    } catch (error) {
        console.error(`Error fetching price for ${category} - ${name}:`, error);
        return 0;
    }
};

const calculateDbTotalPrice = async (carData) => {
    const { exterior, wheels, roof, interior } = carData;

    const exteriorPrice = await getPriceFromDB('exterior', exterior);
    const wheelsPrice = await getPriceFromDB('wheels', wheels);
    const roofPrice = await getPriceFromDB('roof', roof);
    const interiorPrice = await getPriceFromDB('interior', interior);

    return BASE_PRICE + exteriorPrice + wheelsPrice + roofPrice + interiorPrice;
};

export const getAllCars = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cars');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM cars WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const createCar = async (req, res) => {
    try {
        const { name, is_convertible, exterior, roof, wheels, interior } = req.body;

        const selectedRoof = await pool.query(
            'SELECT is_convertible_only FROM options WHERE category = $1 AND name = $2',
            ['roof', roof]
        );

        if (selectedRoof.rows.length > 0) {
            const roofData = selectedRoof.rows[0];
            if (roofData.is_convertible_only && !is_convertible) {
                return res.status(400).json({ error: `Roof '${roof}' is for convertible models only.` });
            }
            if (!roofData.is_convertible_only && is_convertible) {
                return res.status(400).json({ error: `Roof '${roof}' is not compatible with convertible models.` });
            }
        } else {
            return res.status(400).json({ error: `Roof '${roof}' not found.` });
        }

        const totalPrice = await calculateDbTotalPrice(req.body);

        const result = await pool.query(
            'INSERT INTO cars (name, is_convertible, exterior, roof, wheels, interior, total_price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, is_convertible, exterior, roof, wheels, interior, totalPrice]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, is_convertible, exterior, roof, wheels, interior } = req.body;

        const selectedRoof = await pool.query(
            'SELECT is_convertible_only FROM options WHERE category = $1 AND name = $2',
            ['roof', roof]
        );
        
        if (selectedRoof.rows.length > 0) {
            const roofData = selectedRoof.rows[0];
            if (roofData.is_convertible_only && !is_convertible) {
                return res.status(400).json({ error: `Roof '${roof}' is for convertible models only.` });
            }
            if (!roofData.is_convertible_only && is_convertible) {
                return res.status(400).json({ error: `Roof '${roof}' is not compatible with convertible models.` });
            }
        } else {
             return res.status(400).json({ error: `Roof '${roof}' not found.` });
        }

        const totalPrice = await calculateDbTotalPrice(req.body);

        const result = await pool.query(
            'UPDATE cars SET name = $1, is_convertible = $2, exterior = $3, roof = $4, wheels = $5, interior = $6, total_price = $7 WHERE id = $8 RETURNING *',
            [name, is_convertible, exterior, roof, wheels, interior, totalPrice, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM cars WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.status(200).json({ message: 'Car deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
