import express from 'express';
import Contact from '../models/Contact';
import { encrypt, decrypt } from '../utils/encryption';
import jwt from 'jsonwebtoken';

import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

router.use(authenticateToken);

// Get all contacts
router.get('/', async (req: any, res) => {
    try {
        const contacts = await Contact.find({ userId: req.userId });
        const decryptedContacts = contacts.map(c => {
            const contactObj = c.toObject();
            contactObj.mobileNumber = decrypt(contactObj.mobileNumber);
            return contactObj;
        });
        return res.json(decryptedContacts);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching contacts', error });
    }
});

// Create contact
router.post('/', async (req: any, res) => {
    try {
        const { name, mobileNumber, email, category, notes } = req.body;
        const encryptedMobile = encrypt(mobileNumber);

        const contact = new Contact({
            userId: req.userId,
            name,
            mobileNumber: encryptedMobile,
            email,
            category,
            notes
        });

        await contact.save();
        const savedContact = contact.toObject();
        savedContact.mobileNumber = mobileNumber;
        return res.status(201).json(savedContact);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating contact', error });
    }
});

// Update contact
router.put('/:id', async (req: any, res) => {
    try {
        const { name, mobileNumber, email, category, notes } = req.body;
        const updateData: any = { name, email, category, notes };

        if (mobileNumber) {
            updateData.mobileNumber = encrypt(mobileNumber);
        }

        const contact = await Contact.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            updateData,
            { new: true }
        );

        if (!contact) return res.status(404).json({ message: 'Contact not found' });

        const updatedContact = contact.toObject();
        updatedContact.mobileNumber = decrypt(updatedContact.mobileNumber);
        return res.json(updatedContact);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating contact', error });
    }
});

// Delete contact
router.delete('/:id', async (req: any, res) => {
    try {
        const contact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        return res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting contact', error });
    }
});

export default router;
