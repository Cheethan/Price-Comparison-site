const axios = require('axios');

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({ message: 'Keyword is required.' });
    }

    const url = `https://pricee.com/api/v1/search.php?q=${keyword}&size=226&lang=en&vuid=0&prev_id=26271083&platform=1`;

    const response = await axios.get(url);
    const products = response.data.data;

    const combinedProducts = [];

    products.forEach(product => {
      // Check if the product already exists by title
      let existingProduct = combinedProducts.find(p => p.title === product.title);

      if (!existingProduct) {
        // Remove "http://" or "https://" from the URL
        const cleanUrl = product.url.replace(/^https?:\/\//, '');

        // If the product doesn't exist, create a new entry
        combinedProducts.push({
          title: product.title,
          price: product.source_price,
          reviews: product.source_review,
          reviews_count: product.source_review_count,
          image: product.image,
          url: cleanUrl,  // Cleaned product listing URL
          sources: [{
            source_name: product.source_name,
            price: product.source_price,
            reviews: product.source_review,
            reviews_count: product.source_review_count,
            source_url: cleanUrl,  // Cleaned URL pointing to the product's page
            source_logo: product.source_logo
          }],
          brand: product.brand,
          stock: product.stock,
          category: product.main_category,
          rating: product.source_rating,
          offers: product.offers
        });
      } else {
        // Remove "http://" or "https://" from the URL
        const cleanUrl = product.url.replace(/^https?:\/\//, '');

        // If the product exists, merge the source details
        existingProduct.sources.push({
          source_name: product.source_name,
          price: product.source_price,
          reviews: product.source_review,
          reviews_count: product.source_review_count,
          source_url: cleanUrl,  // Cleaned URL pointing to the product's page
          source_logo: product.source_logo
        });
        
        // Keep the product with the highest reviews
        if (product.source_review > existingProduct.reviews) {
          existingProduct.reviews = product.source_review;
          existingProduct.reviews_count = product.source_review_count;
          existingProduct.price = product.source_price;  // Update price if the product with more reviews has a different price
          existingProduct.image = product.image;  // Update image to the one from the highest review product
          existingProduct.url = cleanUrl;  // Update URL to the cleaned one from the highest review product
        }
      }
    });

    // Send the combined products to the frontend
    res.status(200).json(combinedProducts);

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error searching products', error });
  }
};

// Function to get details of a single product (optional)
const getSingleProduct = (req, res) => {
  const { id } = req.params;

  // This is a placeholder, replace with logic to fetch from a cache or DB
  const product = cachedProducts.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(200).json(product);
};

module.exports = { searchProducts, getSingleProduct };
