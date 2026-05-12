import express from 'express';
import { submitRecord, getLeaderboard, getUserRecords } from '../controllers/recordController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/', authMiddleware, submitRecord);
router.get('/leaderboard', getLeaderboard);
router.get('/my-records', authMiddleware, getUserRecords);
export default router;