import {  Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/', authenticateToken, async (req, res) => {
    
});

export default router;