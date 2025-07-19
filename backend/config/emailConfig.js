const nodemailer = require('nodemailer');

// Email configuration
const emailConfig = {
    service: 'gmail',
    auth: {
        user: 'revanthambati143@gmail.com',
        pass: 'tosu zqxk easo wger' // App password
    }
};

// Create transporter with detailed debugging
const transporter = nodemailer.createTransport({
    service: emailConfig.service,
    auth: emailConfig.auth,
    debug: true, // Enable debug output
    logger: true // Enable logger
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Email sending function with detailed logging
const sendEmail = async (to, subject, text, html) => {
    try {
        console.log('Attempting to send email to:', to);
        console.log('Email subject:', subject);
        
        const mailOptions = {
            from: emailConfig.auth.user,
            to,
            subject,
            text,
            html
        };

        console.log('Mail options prepared:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject
        });

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = {
    sendEmail,
    transporter
}; 