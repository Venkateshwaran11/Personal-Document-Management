import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    const secret = process.env['JWT_SECRET'] || 'secret';
    console.log(`[Auth] Verifying token with secret: ${secret.substring(0, 3)}...`);

    return jwt.verify(token, secret, (err: any, user: any) => {
        if (err) {
            console.error('[Auth] JWT Verification Failed:', err.message);
            return res.status(403).json({
                message: 'Invalid or expired token',
                error: err.message,
                secret_source: process.env['JWT_SECRET'] ? 'env' : 'fallback'
            });
        }
        console.log('[Auth] JWT Verified for user:', user.userId);
        req.userId = user.userId;
        return next();
    });
};
