import express from 'express';

import {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
} from '../controllers/cars.js';

const router = express.Router();

router.route('/')
    .get(getAllCars)
    .post(createCar);

router.route('/:id')
    .get(getCarById)
    .put(updateCar)
    .delete(deleteCar);

export default router;