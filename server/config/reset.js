import { pool } from './database.js';

const options = [
    // Exterior
    { category: 'exterior', name: 'Arctic White', price: 0, is_convertible_only: false },
    { category: 'exterior', name: 'Black', price: 0, is_convertible_only: false },
    { category: 'exterior', name: 'Torch Red', price: 500, is_convertible_only: false },
    { category: 'exterior', name: 'Silver Flare', price: 500, is_convertible_only: false },
    { category: 'exterior', name: 'Hypersonic Gray', price: 500, is_convertible_only: false },
    { category: 'exterior', name: 'Amplify Orange', price: 995, is_convertible_only: false },
    { category: 'exterior', name: 'Rapid Blue', price: 995, is_convertible_only: false },
    { category: 'exterior', name: 'Red Mist', price: 995, is_convertible_only: false },
    // Wheels
    { category: 'wheels', name: 'Bright Silver', price: 0, is_convertible_only: false },
    { category: 'wheels', name: 'Carbon Flash', price: 995, is_convertible_only: false },
    { category: 'wheels', name: 'Spectra Gray', price: 1495, is_convertible_only: false },
    { category: 'wheels', name: 'Bronze Forged', price: 2695, is_convertible_only: false },
    { category: 'wheels', name: 'Visible Carbon', price: 3495, is_convertible_only: false },
    // Roof
    { category: 'roof', name: 'Body Color', price: 0, is_convertible_only: false },
    { category: 'roof', name: 'Transparent Roof', price: 1500, is_convertible_only: true },
    { category: 'roof', name: 'Dual Roof', price: 2500, is_convertible_only: false },
    { category: 'roof', name: 'Carbon Fiber', price: 3500, is_convertible_only: false },
    // Interior
    { category: 'interior', name: 'Jet Black', price: 0, is_convertible_only: false },
    { category: 'interior', name: 'Sky Cool Gray', price: 595, is_convertible_only: false },
    { category: 'interior', name: 'Adrenaline Red', price: 595, is_convertible_only: false },
    { category: 'interior', name: 'Natural Dipped', price: 1495, is_convertible_only: false },
    { category: 'interior', name: 'Two-Tone Blue', price: 1495, is_convertible_only: false },
];

export const seedDatabase = async () => {
    try {
        // Create cars table (if not exists)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cars (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                is_convertible BOOLEAN DEFAULT false,
                exterior VARCHAR(255) NOT NULL,
                wheels VARCHAR(255) NOT NULL,
                roof VARCHAR(255) NOT NULL,
                interior VARCHAR(255) NOT NULL,
                total_price INTEGER NOT NULL
            );
        `);

        // Create options table (if not exists)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS options (
                id SERIAL PRIMARY KEY,
                category VARCHAR(100) NOT NULL,
                name VARCHAR(255) NOT NULL,
                price INTEGER NOT NULL,
                is_convertible_only BOOLEAN DEFAULT false
            );
        `);

        // Check if options table is empty
        const result = await pool.query('SELECT COUNT(*) FROM options');
        if (result.rows[0].count > 0) {
            console.log('Options table already seeded.');
            return;
        }

        // Insert options
        for (const option of options) {
            await pool.query(
                'INSERT INTO options (category, name, price, is_convertible_only) VALUES ($1, $2, $3, $4)',
                [option.category, option.name, option.price, option.is_convertible_only]
            );
        }
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};
