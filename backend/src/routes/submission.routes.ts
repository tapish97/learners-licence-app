import express from 'express';
import {
  createSubmission,
  getAllSubmissions,
  updateSubmissionStatus,
} from '../controllers/submission.controller';
import { authenticateAdmin } from '../utils/auth';
import upload from '../config/multer'; // ✅ Cloudinary-based multer

const router = express.Router();

// POST /api/submissions - Form submission with Cloudinary upload
router.post(
  '/',
  upload.fields([
    { name: 'aadhaarFile', maxCount: 1 },
    { name: 'photoFile', maxCount: 1 },
    { name: 'signatureFile', maxCount: 1 },
  ]),
  createSubmission as any
);

// GET /api/submissions - Admin dashboard (protected)
router.get('/', authenticateAdmin, getAllSubmissions);

// PATCH /api/submissions/:id/status - Update status (protected)
router.patch('/:id/status', authenticateAdmin, updateSubmissionStatus as any);

export default router;
