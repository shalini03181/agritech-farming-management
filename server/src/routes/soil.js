import { Router } from 'express';
import SoilAnalysis from '../models/SoilAnalysis.js';
import auth from '../middleware/auth.js';
const router = Router();
router.use(auth);
router.get('/', async (req, res, next) => { try { res.json(await SoilAnalysis.find({ owner: req.user._id }).sort({ createdAt: -1 })); } catch (e) { next(e); } });
router.post('/', async (req, res, next) => {
  try {
    const { location, soilType, ph, nitrogen, phosphorus, potassium, moisture } = req.body;
    if (!location || !soilType || ph === undefined || Number(ph) < 0 || Number(ph) > 14) return res.status(400).json({ message: 'Location, soil type, and pH from 0 to 14 are required.' });
    res.status(201).json(await SoilAnalysis.create({ owner: req.user._id, location, soilType, ph, nitrogen, phosphorus, potassium, moisture }));
  } catch (e) { next(e); }
});
export default router;
