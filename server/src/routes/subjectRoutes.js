import express from 'express';
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  addTopic,
  updateTopic,
  completeRevision,
  deleteTopic
} from '../controllers/subjectController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All subject routes require authentication

router.route('/')
  .get(getSubjects)
  .post(createSubject);

router.route('/:id')
  .get(getSubjectById)
  .put(updateSubject)
  .delete(deleteSubject);

router.post('/:id/topics', addTopic);
router.put('/:id/topics/:topicId', updateTopic);
router.post('/:id/topics/:topicId/revision', completeRevision);
router.delete('/:id/topics/:topicId', deleteTopic);

export default router;
