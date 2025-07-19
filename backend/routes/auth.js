const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendEmail } = require('../config/emailConfig');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request OTP route
router.post('/request-otp', async (req, res) => {
    const { email } = req.body;
    console.log('Requesting OTP for:', email);

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already registered'
            });
        }

        // Generate OTP
        const otp = generateOTP();
        console.log('Generated OTP:', otp);

        // Save OTP to database
        await OTP.findOneAndUpdate(
            { email },
            { email, otp },
            { upsert: true, new: true }
        );

        // Send OTP via email
        const emailContent = `
            <h1>Your OTP for Estate Registration</h1>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 5 minutes.</p>
        `;

        await sendEmail(
            email,
            'Your Estate Registration OTP',
            `Your OTP is: ${otp}`,
            emailContent
        );

        console.log('OTP sent successfully to:', email);
        res.json({
            success: true,
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending OTP'
        });
    }
});

// Signup route with OTP verification
router.post('/signup', async (req, res) => {
    const { name, email, password, otp } = req.body;
    console.log('Signup attempt for:', email);

    try {
        // Validate required fields
        if (!name || !email || !password || !otp) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Verify OTP
        const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'OTP not found or expired'
            });
        }

        // Check if OTP is expired (5 minutes)
        const otpAge = Date.now() - otpRecord.createdAt;
        if (otpAge > 5 * 60 * 1000) {
            await OTP.deleteOne({ email });
            return res.status(400).json({
                success: false,
                message: 'OTP expired'
            });
        }

        // Verify OTP
        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user'
        });

        // Delete used OTP
        await OTP.deleteOne({ email });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({
            success: false,
            message: 'Error in registration'
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Me route (check token)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // Find user by ID from the auth middleware and exclude password
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        address: user.address,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle favorite route
router.put('/favorites', authMiddleware, async (req, res) => {
  const { propertyId } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const propertyObjectId = new mongoose.Types.ObjectId(propertyId);

    const index = user.favorites.findIndex(fav => fav.equals(propertyObjectId));

    if (index > -1) {
      // Property is already favorited, remove it
      user.favorites.splice(index, 1);
    } else {
      // Property is not favorited, add it
      user.favorites.push(propertyObjectId);
    }

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error('Error toggling favorite:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { name, email, phoneNumber, gender, address, bio } = req.body;
    
    // Find user by ID from the auth middleware
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (gender !== undefined) user.gender = gender;
    if (address !== undefined) user.address = address;
    if (bio !== undefined) user.bio = bio;

    // Save updated user
    const updatedUser = await user.save();

    res.json({
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        phoneNumber: updatedUser.phoneNumber,
        gender: updatedUser.gender,
        address: updatedUser.address,
        bio: updatedUser.bio,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await User.findByIdAndUpdate(req.userId, { password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Forgot Password - Request OTP
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = generateOTP();
        await OTP.findOneAndUpdate(
            { email },
            { otp },
            { upsert: true, new: true }
        );

        const emailContent = `
            <h1>Password Reset Request</h1>
            <p>Your OTP for password reset is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 5 minutes.</p>
        `;

        await sendEmail(email, 'Password Reset OTP', 'Password Reset OTP', emailContent);

        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error in forgot password:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
});

// Verify OTP and Reset Password
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        // Delete used OTP
        await OTP.deleteOne({ email, otp });

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        console.error('Error in reset password:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
});

module.exports = router;
