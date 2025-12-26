import mongoose, { Schema } from 'mongoose';

const DocumentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['Aadhar', 'PAN', 'Passport', 'VoterID', 'Driving License', 'Ration Card', 'University', 'Insurance', 'Other'], required: true },
    docNumber: { type: String, required: true },
    metadata: { type: Object },
    fileUrl: { type: String },
}, { timestamps: true });

export default mongoose.models['Document'] || mongoose.model('Document', DocumentSchema);
