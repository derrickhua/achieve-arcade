import Reward from "../models/reward.js";

// Create a new reward
export const createReward = async (req, res, next) => {
    const { name, icon, chestType } = req.body;
    try {
      const reward = new Reward({ name, icon, chestType });
      await reward.save();
      res.status(201).json(reward);
    } catch (error) {
      next(error);
    }
  };
  
  // Get all rewards
  export const getAllRewards = async (req, res, next) => {
    try {
      const rewards = await Reward.find();
      res.json(rewards);
    } catch (error) {
      next(error);
    }
  };
  
  // Get a specific reward
  export const getReward = async (req, res, next) => {
    const { rewardId } = req.params;
    try {
      const reward = await Reward.findById(rewardId);
      if (!reward) return res.status(404).json({ message: 'Reward not found' });
      res.json(reward);
    } catch (error) {
      next(error);
    }
  };
  
  // Update a reward
  export const updateReward = async (req, res, next) => {
    const { rewardId } = req.params;
    const { name, icon, chestType } = req.body;
    try {
      const reward = await Reward.findByIdAndUpdate(rewardId, { name, icon, chestType }, { new: true });
      if (!reward) return res.status(404).json({ message: 'Reward not found' });
      res.json(reward);
    } catch (error) {
      next(error);
    }
  };
  
  // Delete a reward
  export const deleteReward = async (req, res, next) => {
    const { rewardId } = req.params;
    try {
      const reward = await Reward.findByIdAndDelete(rewardId);
      if (!reward) return res.status(404).json({ message: 'Reward not found' });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

/**
 * Purchases a chest and deducts coins from the user.
 * @param {Object} req - The request object containing user ID and chest type.
 * @param {Object} res - The response object to send back the selected reward or nothing.
 */
export const purchaseChest = async (req, res) => {
  const { chestType } = req.body;
  const userId = req.user._id;

  const chestCosts = {
    Wood: 10,
    Metal: 40,
    Gold: 100
  };

  const chestProbabilities = {
    Wood: { nothing: 0.3, wood: 0.5, metal: 0.15, gold: 0.05 },
    Metal: { nothing: 0.2, wood: 0.1, metal: 0.6, gold: 0.1 },
    Gold: { nothing: 0.1, wood: 0.05, metal: 0.2, gold: 0.65 }
  };

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cost = chestCosts[chestType];
    const probabilities = chestProbabilities[chestType];
    if (!cost || !probabilities) {
      return res.status(400).json({ message: 'Invalid chest type' });
    }

    await user.deductCoins(cost);

    // Determine the outcome
    const randomValue = Math.random();
    let rewardCategory;
    if (randomValue < probabilities.nothing) {
      return res.status(200).json({ message: 'No reward received' });
    } else if (randomValue < probabilities.nothing + probabilities.wood) {
      rewardCategory = 'Wood';
    } else if (randomValue < probabilities.nothing + probabilities.wood + probabilities.metal) {
      rewardCategory = 'Metal';
    } else {
      rewardCategory = 'Gold';
    }

    const rewards = await Reward.find({ chestType: rewardCategory });
    const reward = selectReward(rewardCategory, rewards);

    res.status(200).json({ reward });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
