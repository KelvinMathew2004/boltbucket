import pool from '../database.js';

const BASE_PRICE = 65000;

const componentPrices = {
    exterior: {
        'Starlight Black': 1000,
        'Cosmic Silver': 800,
        'Solar Flare Red': 1200,
        'Arctic White': 0
    },
    wheels: {
        '18" Standard Alloy': 0,
        '19" Sport Edition': 750,
        '20" Performance Forged': 1500
    },
    interior: {
        'Black Cloth Seats': 0,
        'Gray Leatherette': 900,
        'Premium Red Leather': 2200
    }
};

const standardRoofs = {
    'Standard Body-Color': 0,
    'Panoramic Glass Roof': 1800,
    'Carbon Fiber Weave': 3000
};

const convertibleRoofs = {
    'Black Soft Top': 2500,
    'Body-Color Hard Top': 4000
};

const calculateTotalPrice = (components, is_convertible) => {
    const { exterior, wheels, roof, interior } = components;
    const exteriorPrice = componentPrices.exterior[exterior] || 0;
    const wheelsPrice = componentPrices.wheels[wheels] || 0;
    const interiorPrice = componentPrices.interior[interior] || 0;

    let roofPrice = 0;
    if (is_convertible) {
        roofPrice = convertibleRoofs[roof] || 0;
    } else {
        roofPrice = standardRoofs[roof] || 0;
    }

    return BASE_PRICE + exteriorPrice + wheelsPrice + roofPrice + interiorPrice;
};

export const getAllCars = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cars ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error('Error fetching all cars:', error);
    }
};

export const getCarById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('SELECT * FROM cars WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Car configuration not found.');
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(`Error fetching car with ID ${id}:`, error);
    }
};

export const createCar = async (req, res) => {
    const { name, exterior, wheels, roof, interior, is_convertible } = req.body;

    if (!name || !exterior || !wheels || !roof || !interior || is_convertible === undefined) {
        return res.status(400).json({ error: 'Missing required car components for creation.' });
    }

    const roofOptions = is_convertible ? convertibleRoofs : standardRoofs;
    if (!roofOptions.hasOwnProperty(roof)) {
        return res.status(400).json({ error: 'Invalid roof option for the selected car type.' });
    }

    const total_price = calculateTotalPrice({ exterior, wheels, roof, interior }, is_convertible);

    try {
        const result = await pool.query(
            'INSERT INTO cars (name, exterior, wheels, roof, interior, is_convertible, total_price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, exterior, wheels, roof, interior, is_convertible, total_price]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error('Error creating a new car:', error);
    }
};

export const updateCar = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, exterior, wheels, roof, interior, is_convertible } = req.body;

    try {
        const currentCarResult = await pool.query('SELECT * FROM cars WHERE id = $1', [id]);
        if (currentCarResult.rows.length === 0) {
            return res.status(404).send('Car not found, nothing to update.');
        }
        const currentCar = currentCarResult.rows[0];

        const updatedConfig = {
            name: name !== undefined ? name : currentCar.name,
            exterior: exterior !== undefined ? exterior : currentCar.exterior,
            wheels: wheels !== undefined ? wheels : currentCar.wheels,
            roof: roof !== undefined ? roof : currentCar.roof,
            interior: interior !== undefined ? interior : currentCar.interior,
        };

        const final_is_convertible = is_convertible !== undefined ? is_convertible : currentCar.is_convertible;

        const roofOptions = final_is_convertible ? convertibleRoofs : standardRoofs;
        if (!roofOptions.hasOwnProperty(updatedConfig.roof)) {
            return res.status(400).json({ error: 'Invalid roof option for the selected car type.' });
        }

        const total_price = calculateTotalPrice(updatedConfig, final_is_convertible);

        const result = await pool.query(
            'UPDATE cars SET name = $1, exterior = $2, wheels = $3, roof = $4, interior = $5, is_convertible = $6, total_price = $7 WHERE id = $8 RETURNING *',
            [updatedConfig.name, updatedConfig.exterior, updatedConfig.wheels, updatedConfig.roof, updatedConfig.interior, final_is_convertible, total_price, id]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(`Error updating car with ID ${id}:`, error);
    }
};

export const deleteCar = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('DELETE FROM cars WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Car not found, nothing deleted.');
        }
        res.status(200).send(`Car config "${result.rows[0].name}" (ID: ${id}) deleted successfully.`);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(`Error deleting car with ID ${id}:`, error);
    }
};

