import User from '../models/User';

export const isAdmin = async (req: any, res: any, next: any) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'User ID not found in request' });
        }

        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error checking admin status' });
    }
};
