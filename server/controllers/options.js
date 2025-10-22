import { pool } from '../config/database.js';

export const getAllOptions = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM options');
        
        // Group options by category
        const groupedOptions = result.rows.reduce((acc, option) => {
            const { category } = option;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(option);
            return acc;
        }, {});

        res.json(groupedOptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
