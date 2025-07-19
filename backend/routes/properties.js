const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Property = require('../models/Property');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Get all properties
router.get('/properties', async (req, res) => {
  try {
    // Handle filtering
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.listingType) filter.listingType = req.query.listingType;
    if (req.query.minPrice) filter.price = { $gte: Number(req.query.minPrice) };
    if (req.query.maxPrice) {
      filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };
    }
    if (req.query.minBedrooms) filter.bedrooms = { $gte: Number(req.query.minBedrooms) };
    if (req.query.minBathrooms) filter.bathrooms = { $gte: Number(req.query.minBathrooms) };
    if (req.query.minArea) filter.area = { $gte: Number(req.query.minArea) };
    if (req.query.location) filter.location = { $regex: req.query.location, $options: 'i' };

    const properties = await Property.find(filter)
      .populate('owner', 'name email')
      .populate('comments.user', 'name email');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific property
router.get('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email')
      .populate({
        path: 'comments.user',
        select: 'name email'
      });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new property with image upload
router.post('/properties', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    // Get image paths from uploaded files
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    
    // Process features safely
    const features = typeof req.body.features === 'string' && req.body.features.trim()
      ? req.body.features.split(',').map(item => item.trim())
      : [];

    // Create property with image paths
    const property = new Property({
      ...req.body,
      price: Number(req.body.price),
      bedrooms: Number(req.body.bedrooms),
      bathrooms: Number(req.body.bathrooms),
      area: Number(req.body.area),
      features: features,
      images: imagePaths,
      owner: req.userId
    });

    const savedProperty = await property.save();
    const populatedProperty = await Property.findById(savedProperty._id)
      .populate('owner', 'name email')
      .populate('comments.user', 'name email');
    
    res.status(201).json(populatedProperty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ FIXED: Add a comment to a property
router.post('/properties/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { text, rating = 5 } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const newComment = {
      text: text.trim(),
      user: req.userId, // Use req.userId from authMiddleware
      rating: Number(rating),
      createdAt: new Date()
    };

    // Add the comment to the property
    property.comments.push(newComment);
    await property.save();

    // Return the updated property with populated comments
    const updatedProperty = await Property.findById(req.params.id)
      .populate('owner', 'name email')
      .populate({
        path: 'comments.user',
        select: 'name email'
      });

    res.json(updatedProperty);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a property
router.delete('/properties/:id', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ msg: 'Property not found' });
    }

    // Allow admin to delete any property, regular users can only delete their own
    if (req.userRole !== 'admin' && property.owner.toString() !== req.userId) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Delete associated images
    if (property.images && property.images.length > 0) {
      property.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    await Property.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Property removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Property not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Update a property
router.put('/properties/:id', authMiddleware, upload.array('newImages', 10), async (req, res) => {
  try {
    const propertyId = req.params.id;
    const updates = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ msg: 'Property not found' });
    }

    // Check if user owns the property
    if (property.owner.toString() !== req.userId) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Handle image updates
    let existingImages = JSON.parse(updates.existingImages || '[]');
    let newImagePaths = [];

    if (req.files && req.files.length > 0) {
      newImagePaths = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Combine existing images (that were not removed) and new images
    const finalImages = [...existingImages, ...newImagePaths];

    // Delete old images that are no longer in finalImages
    property.images.forEach(imagePath => {
      if (!finalImages.includes(imagePath)) {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath, (err) => {
            if (err) console.error(`Failed to delete old image: ${fullPath}`, err);
          });
        }
      }
    });

    // Update property fields
    property.title = updates.title || property.title;
    property.description = updates.description || property.description;
    property.price = Number(updates.price) || property.price;
    property.location = updates.location || property.location;
    property.bedrooms = Number(updates.bedrooms) || property.bedrooms;
    property.bathrooms = Number(updates.bathrooms) || property.bathrooms;
    property.area = Number(updates.area) || property.area;
    property.type = updates.type || property.type;
    property.listingType = updates.listingType || property.listingType;

    // Process features safely
    property.features = typeof updates.features === 'string' && updates.features.trim()
      ? updates.features.split(',').map(item => item.trim())
      : property.features;

    property.images = finalImages;

    const updatedProperty = await property.save();
    const populatedProperty = await Property.findById(updatedProperty._id)
      .populate('owner', 'name email')
      .populate('comments.user', 'name email');

    res.json(populatedProperty);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a comment from a property - FIXED VERSION
router.delete('/properties/:propertyId/comments/:commentId', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Find the comment index
    const commentIndex = property.comments.findIndex(
      comment => comment._id.toString() === req.params.commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Allow admin to delete any comment, regular users can only delete their own
    if (req.userRole !== 'admin' && 
        property.comments[commentIndex].user.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized to delete this comment' });
    }

    // FIXED: Use new mongoose.Types.ObjectId() instead of mongoose.Types.ObjectId()
    await Property.findByIdAndUpdate(
      req.params.propertyId,
      {
        $pull: {
          comments: { _id: new mongoose.Types.ObjectId(req.params.commentId) }
        }
      },
      { new: true }
    );

    // Return the updated property with populated fields
    const updatedProperty = await Property.findById(req.params.propertyId)
      .populate('owner', 'name email')
      .populate({
        path: 'comments.user',
        select: 'name email'
      });

    res.json(updatedProperty);
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});
module.exports = router;