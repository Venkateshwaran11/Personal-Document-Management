import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth';
import docRoutes from './routes/docs';
import adminRoutes from './routes/admin';
import contactRoutes from './routes/contacts';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database connection logic
const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    try {
        const uri = process.env['MONGO_URI'];
        if (!uri) throw new Error('MONGO_URI is not defined in environment variables. Please check .env file.');

        // Add connection options for better stability
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

// Middleware: Connect to DB before handling ANY request
app.use(async (req, res, next) => {
    // Skip DB connection for basic health check if needed, but better to check it.
    if (req.path === '/api' && req.method === 'GET') {
        // Optional: allow health check without DB? 
        // For now, let's just connect.
    }

    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Middleware DB Connection Failed");
        res.status(500).json({ message: 'Database connection failed. Please ensure MongoDB is running and MONGO_URI is correct.', error: String(error) });
    }
});

app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to Personal Docs Manager API' });
});

// Register Routes AFTER DB Middleware
app.use('/api/auth', authRoutes);
app.use('/api/docs', docRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contacts', contactRoutes);

export default app;
