// routes/reward.js
import express from 'express';
import {
  createReward,
  getAllRewards,
  getReward,
  updateReward,
  deleteReward,
  purchaseChest
} from '../controllers/reward.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createReward);
router.get('/', getAllRewards);
router.get('/:rewardId', getReward);
router.put('/:rewardId', updateReward);
router.delete('/:rewardId', deleteReward);
router.post('/purchase-chest', purchaseChest);

export default router;
