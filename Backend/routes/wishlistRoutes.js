const express = require('express');
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/wishlist → add product
router.post('/', protect, addToWishlist);

// GET /api/wishlist → get user's wishlist
router.get('/', protect, getWishlist);

// DELETE /api/wishlist/:id → remove product from wishlist
router.delete('/:id', protect, removeFromWishlist);

module.exports = router;
