import express from 'express';

import {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
} from '../controllers/carsController.js';

const router = express.Router();

router.route('/')
    .get(getAllCars)
    .post(createCar);

router.route('/:id')
    .get(getCarById)
    .put(updateCar)
    .delete(deleteCar);

export default router;