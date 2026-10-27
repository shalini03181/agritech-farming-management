import { Router } from 'express';
import Crop from '../models/Crop.js';
import Farm from '../models/Farm.js';
import auth from '../middleware/auth.js';
const router = Router();
router.use(auth);
router.get('/', async (req, res, next) => { try { res.json(await Crop.find({ owner: req.user._id }).populate('farm', 'name').sort({ createdAt: -1 })); } catch (e) { next(e); } });
router.post('/', async (req, res, next) => {
  try {
    const { name, farm, sowingDate, expectedHarvest, area, stage, notes } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Crop name is required.' });
    if (farm && !(await Farm.findOne({ _id: farm, owner: req.user._id }))) return res.status(400).json({ message: 'Choose one of your own farms.' });
    res.status(201).json(await Crop.create({ owner: req.user._id, name, farm: farm || null, sowingDate: sowingDate || null, expectedHarvest: expectedHarvest || null, area, stage, notes }));
  } catch (e) { next(e); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    const crop = await Crop.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!crop) return res.status(404).json({ message: 'Crop not found.' });
    res.json({ message: 'Crop deleted.' });
  } catch (e) { next(e); }
});
export default router;
