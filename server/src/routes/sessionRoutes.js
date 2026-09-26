import express from 'express';
import { getSessions, createSession, deleteSession } from '../controllers/sessionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getSessions)
  .post(createSession);

router.delete('/:id', deleteSession);

export default router;
