import express from 'express';
import { getMockTests, createMockTest, deleteMockTest } from '../controllers/mockTestController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMockTests)
  .post(createMockTest);

router.delete('/:id', deleteMockTest);

export default router;
