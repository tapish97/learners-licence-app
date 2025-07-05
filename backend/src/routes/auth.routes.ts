import express from 'express';
import { loginAdmin } from '../controllers/auth.controller';
import { authenticateAdmin } from '../utils/auth';

const router = express.Router();

// POST /api/auth/login
router.post('/login', loginAdmin as any);
router.get('/verify', authenticateAdmin, (req, res) => {
    res.json({ valid: true });
  });
  
export default router;
