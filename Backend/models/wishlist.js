const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: String, required: true },  
      title: { type: String, required: true },
      price: { type: String, required: true },
      description: { type: String },
      image: { type: String },
      manufacturer: { type: String },
      rating: { type: String },
      sources: [
        {
          source_name: { type: String },
          source_logo: { type: String },
          source_url: { type: String },
          price: { type: String },
          reviews_count: { type: String }
        }
      ]
    }
  ]
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
