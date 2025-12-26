import mongoose, { Schema } from 'mongoose';

const ContactSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true }, // Encrypted
    email: { type: String },
    category: { type: String, enum: ['Personal', 'Work', 'Emergency', 'Other'], default: 'Personal' },
    notes: { type: String }
}, { timestamps: true });

export default mongoose.models['Contact'] || mongoose.model('Contact', ContactSchema);
