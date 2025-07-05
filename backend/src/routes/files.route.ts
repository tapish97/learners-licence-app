import express from 'express';
import path from 'path';
import { authenticateAdmin } from '../utils/auth';

const router = express.Router();

// GET /api/files/:filename (protected)
router.get('/:filename', authenticateAdmin, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads', filename); // adjust path if needed
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('❌ Error sending file:', err);
      res.status(404).json({ message: 'File not found' });
    }
  });
});

export default router;
