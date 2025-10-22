import express from 'express';
import { getAllOptions } from '../controllers/options.js';

const router = express.Router();

router.get('/', getAllOptions);

export default router;
