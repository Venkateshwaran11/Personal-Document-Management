import express from 'express';
import User from '../models/User';
import Document from '../models/Document';
import Contact from '../models/Contact';
import { isAdmin } from '../middlewares/admin';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

// Protect all admin routes
router.use(authenticateToken);
router.use(isAdmin);

router.use((req: any, res: any, next: any) => {
    console.log(`[Admin] ${req.method} ${req.path} - User: ${req.userId}`);
    next();
});

// GET /users - List all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users' });
    }
});

// DELETE /users/:id - Delete user and their documents
router.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Delete user
        await User.findByIdAndDelete(userId);

        // Delete all documents belonging to user
        await Document.deleteMany({ userId });
        await Contact.deleteMany({ userId });

        return res.json({ message: 'User and their related data deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting user' });
    }
});

// PUT /users/:id - Update user details or role
router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role } = req.body;
        const adminId = (req as any).userId;

        // Prevent self-demotion
        if (id === adminId && role === 'user') {
            return res.status(400).json({ message: 'You cannot demote yourself from admin.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, email, role },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating user' });
    }
});

// GET /stats - System stats with analytics
router.get('/stats', async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [
            userCount,
            docCount,
            contactCount,
            docsByType,
            contactsByCategory,
            userTrend,
            docTrend,
            contactTrend
        ] = await Promise.all([
            User.countDocuments(),
            Document.countDocuments(),
            Contact.countDocuments(),
            Document.aggregate([
                { $group: { _id: "$type", count: { $sum: 1 } } }
            ]),
            Contact.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } }
            ]),
            // User growth in last 7 days
            User.aggregate([
                { $match: { createdAt: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            // Document growth in last 7 days
            Document.aggregate([
                { $match: { createdAt: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            // Contact growth in last 7 days
            Contact.aggregate([
                { $match: { createdAt: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ])
        ]);

        return res.json({
            users: userCount,
            documents: docCount,
            contacts: contactCount,
            distribution: docsByType,
            categoryDistribution: contactsByCategory,
            trends: {
                users: userTrend,
                documents: docTrend,
                contacts: contactTrend
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        return res.status(500).json({ message: 'Error fetching stats' });
    }
});

export default router;
