import { Router } from 'express';
import Farm from '../models/Farm.js';
import auth from '../middleware/auth.js';
const router = Router();
router.use(auth);
router.get('/', async (req, res, next) => { try { res.json(await Farm.find({ owner: req.user._id }).sort({ createdAt: -1 })); } catch (e) { next(e); } });
router.post('/', async (req, res, next) => {
  try {
    const { name, location, area, soilType, irrigation } = req.body;
    if (!name?.trim() || !location?.trim()) return res.status(400).json({ message: 'Farm name and location are required.' });
    res.status(201).json(await Farm.create({ owner: req.user._id, name, location, area, soilType, irrigation }));
  } catch (e) { next(e); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    const farm = await Farm.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!farm) return res.status(404).json({ message: 'Farm not found.' });
    res.json({ message: 'Farm deleted.' });
  } catch (e) { next(e); }
});
export default router;
