import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  location: { type: String, required: true },
  soilType: { type: String, required: true },
  ph: { type: Number, min: 0, max: 14, required: true },
  nitrogen: { type: Number, min: 0, default: 0 },
  phosphorus: { type: Number, min: 0, default: 0 },
  potassium: { type: Number, min: 0, default: 0 },
  moisture: { type: Number, min: 0, max: 100, default: 0 }
}, { timestamps: true });
export default mongoose.model('SoilAnalysis', schema);
