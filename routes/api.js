// routes/api.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    User,
    LostItem,
    MarketplaceItem,
    Note,
    Notification
} = require('../models');

// Lost & Found endpoints
router.get('/lostfound', auth, async (req, res) => {
    try {
        const items = await LostItem.find({ status: 'approved' })
            .sort({ datePosted: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Marketplace endpoints
router.get('/marketplace', auth, async (req, res) => {
    try {
        const items = await MarketplaceItem.find()
            .sort({ datePosted: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Notes endpoints
router.get('/notes', auth, async (req, res) => {
    try {
        const notes = await Note.find({ status: 'approved' })
            .sort({ dateUploaded: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
