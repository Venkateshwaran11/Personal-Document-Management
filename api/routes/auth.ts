import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Record last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const secret = process.env['JWT_SECRET'] || 'secret';
        console.log(`[Auth] Signing token with secret: ${secret.substring(0, 3)}...`);
        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '7d' });

        return res.json({
            token,
            userId: user._id,
            username: user.username,
            role: user.role,
            email: user.email,
            profileImage: user.profileImage
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});

// Update profile
router.put('/profile', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: 'No token' });

        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, process.env['JWT_SECRET'] || 'secret');

        const { profileImage } = req.body;
        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { profileImage },
            { new: true }
        ).select('-password');

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update profile', error });
    }
});

export default router;
