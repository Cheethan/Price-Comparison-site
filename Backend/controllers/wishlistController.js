const Wishlist = require('../models/wishlist');
const Counter = require('../models/product');
const crypto = require('crypto');

// Function to generate the next unique product ID
const generateProductId = (title, manufacturer, price) => {
  return crypto
    .createHash('sha256')
    .update(`${title}-${manufacturer}-${price}`)
    .digest('hex');
};

// Add a product to the user's wishlist
const addToWishlist = async (req, res) => {
  const { title, price, description, image, manufacturer, rating, sources } = req.body;
  const userId = req.user._id;

  try {
    const productId = generateProductId(title, manufacturer, price); // deterministic ID

    const newProduct = {
      productId,
      title,
      price,
      description,
      image,
      manufacturer,
      rating,
      sources,
    };

    let wishlist = await Wishlist.findOne({ user: userId });

    if (wishlist) {
      if (wishlist.products.some(product => product.productId === newProduct.productId)) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }

      wishlist.products.push(newProduct);
      await wishlist.save();
    } else {
      wishlist = new Wishlist({
        user: userId,
        products: [newProduct],
      });
      await wishlist.save();
    }

    res.status(201).json({ message: 'Product added to wishlist', productId: newProduct.productId });
  } catch (error) {
    console.error('Error adding product to wishlist:');
    res.status(500).json({ message: 'Error adding product to wishlist', error: error.message });
  }
};



const getWishlist = async (req, res) => {
  const userId = req.user._id;

  try {
    const wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    
    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
};

// Remove a product from the user's wishlist
const removeFromWishlist = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.id;

  try {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Filter out the product from the wishlist
    wishlist.products = wishlist.products.filter(product => product.productId !== productId);
    await wishlist.save();  // Save the updated wishlist

    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    res.status(500).json({ message: 'Error removing product from wishlist', error: error.message });
  }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
