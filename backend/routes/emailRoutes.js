const express = require('express');
const router = express.Router();
const { sendEmail } = require('../config/emailConfig');

// Test email route
router.post('/test-email', async (req, res) => {
    console.log('Received test email request');
    console.log('Request body:', req.body);

    try {
        const { to, subject, text, html } = req.body;
        
        console.log('Validating email parameters...');
        if (!to || !subject) {
            console.error('Missing required email parameters');
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required email parameters' 
            });
        }

        console.log('Sending test email...');
        const result = await sendEmail(to, subject, text, html);
        
        console.log('Email sent successfully:', result);
        res.json({ 
            success: true, 
            message: 'Test email sent successfully',
            details: result 
        });
    } catch (error) {
        console.error('Error in test email route:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send test email',
            details: error.message 
        });
    }
});

module.exports = router; 