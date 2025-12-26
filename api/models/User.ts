import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profileImage: { type: String },
    lastLogin: { type: Date },
}, { timestamps: true });

export default mongoose.models['User'] || mongoose.model('User', UserSchema);
