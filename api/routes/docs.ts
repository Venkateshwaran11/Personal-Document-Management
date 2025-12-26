import express from 'express';
import Document from '../models/Document';
import jwt from 'jsonwebtoken';

import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

router.use(authenticateToken);

// GET all documents for logged in user
router.get('/', async (req: any, res) => {
    try {
        const docs = await Document.find({ userId: req.userId }).sort({ createdAt: -1 });
        return res.json(docs);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching documents', error });
    }
});

// POST new document
router.post('/', async (req: any, res) => {
    try {
        const { title, type, docNumber, fileUrl, metadata } = req.body;

        // Simple verification
        if (!title || !type || !docNumber) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newDoc = new Document({
            userId: req.userId,
            title,
            type,
            docNumber,
            fileUrl, // Expecting Base64 or URL
            metadata
        });

        await newDoc.save();
        return res.status(201).json(newDoc);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating document', error });
    }
});

// UPDATE document
router.put('/:id', async (req: any, res) => {
    console.log(`[PUT] Update Doc ID: ${req.params.id}, User ID: ${req.userId}`);
    console.log('[PUT] Payload:', req.body);

    try {
        const { title, type, docNumber, fileUrl, metadata } = req.body;

        const updatedDoc = await Document.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            {
                $set: {
                    title, type, docNumber, metadata,
                    ...(fileUrl && { fileUrl }) // Only update fileUrl if a new one is provided
                }
            },
            { new: true }
        );

        if (!updatedDoc) {
            console.error('[PUT] Document not found or unauthorized');
            return res.status(404).json({ message: 'Document not found' });
        }
        console.log('[PUT] Update successful');
        return res.json(updatedDoc);
    } catch (error) {
        console.error('[PUT] Update failed', error);
        return res.status(500).json({ message: 'Error updating document', error });
    }
});

// DELETE document
router.delete('/:id', async (req: any, res) => {
    try {
        const doc = await Document.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }
        return res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting document', error });
    }
});

export default router;
