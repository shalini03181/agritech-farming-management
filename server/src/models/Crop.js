import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', default: null },
  name: { type: String, required: true, trim: true },
  sowingDate: { type: Date, default: null },
  expectedHarvest: { type: Date, default: null },
  area: { type: Number, min: 0, default: 0 },
  stage: { type: String, default: 'Planned' },
  notes: { type: String, maxlength: 500, default: '' }
}, { timestamps: true });
export default mongoose.model('Crop', schema);
