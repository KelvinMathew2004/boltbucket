import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import dotenv from 'dotenv'
import cors from 'cors';
import carRoutes from './routes/cars.js'
import optionsRoutes from './routes/options.js'; // Import options routes
import { seedDatabase } from './config/reset.js'; // Import seeder

dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()

app.use(cors());
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
    app.use(favicon(path.resolve('../', 'client', 'public', 'lightning.png')))
}
else if (process.env.NODE_ENV === 'production') {
    app.use(favicon(path.resolve('public', 'lightning.png')))
    app.use(express.static('public'))
}

// Add a route to run the seeder
app.get('/api/seed', async (req, res) => {
    await seedDatabase();
    res.send('Database seeded!');
});

app.use('/api/cars', carRoutes);
app.use('/api/options', optionsRoutes); // Use options routes

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
