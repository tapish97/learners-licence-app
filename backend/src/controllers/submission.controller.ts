import { Request, Response } from 'express';
import Submission from '../models/submission.model';
import crypto from 'crypto';
import {
  sendEmailToAdmin,
  sendConfirmationToUser,
  sendStatusUpdateToUser,
} from '../services/email.service';

export const createSubmission = async (req: Request, res: Response) => {
  try {

    const { fullName, phoneNumber, email, dateOfBirth, address } = req.body;

    if (!fullName || !phoneNumber || !email || !dateOfBirth || !address) {
      return res.status(400).json({ message: 'All form fields are required.' });
    }

    const files = req.files as Record<string, Express.Multer.File[]>;

    if (
      !files?.aadhaarFile?.[0] ||
      !files?.photoFile?.[0] ||
      !files?.signatureFile?.[0]
    ) {
      return res.status(400).json({
        message: 'All files are required.',
        receivedFiles: Object.keys(files || {}),
        missingFiles: [
          !files?.aadhaarFile?.[0] && 'aadhaarFile',
          !files?.photoFile?.[0] && 'photoFile',
          !files?.signatureFile?.[0] && 'signatureFile'
        ].filter(Boolean)
      });
    }

    const submissionId = 'SUB-' + crypto.randomBytes(4).toString('hex');

    const newSubmission = new Submission({
      fullName,
      phoneNumber,
      email,
      dateOfBirth,
      address,
      submissionId,
      aadhaarFile: files.aadhaarFile[0].path,     // Cloudinary URL
      photoFile: files.photoFile[0].path,         // Cloudinary URL
      signatureFile: files.signatureFile[0].path, // Cloudinary URL
      status: 'Pending',
      createdAt: new Date(),
    });
    console.log("SubmissionController: Creating new Submission");

    const saved = await newSubmission.save();

    // Send mock email notifications
    try {
      sendEmailToAdmin(submissionId, email);
      console.log("Email")
    } catch (emailErr) {
      console.warn('[Email to admin failed]', emailErr);
    }

    try {
      sendConfirmationToUser(email, submissionId);
    } catch (emailErr) {
      console.warn('[Email to user failed]', emailErr);
    }

    console.log('[createSubmission] saved:', saved);
    res.status(201).json(saved);

  } catch (err: any) {
    console.error('[createSubmission] Error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const getAllSubmissions = async (_req: Request, res: Response) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error('[getAllSubmissions] Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateSubmissionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, internalNotes } = req.body;

    const updated = await Submission.findByIdAndUpdate(
      id,
      { status, internalNotes },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Not found' });
    }

    // Send mock email on status update
    if (updated.email && updated.submissionId && updated.status) {
      sendStatusUpdateToUser(updated.email, updated.submissionId, updated.status);
    }

    res.json(updated);
  } catch (err) {
    console.error('[updateSubmissionStatus] Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
