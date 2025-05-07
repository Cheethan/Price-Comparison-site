const fs = require('fs');
const axios = require('axios');

const url = "https://pricee.com/api/v1/search.php?q=iphone13&size=10&lang=en&vuid=0&prev_id=26271083&platform=1";
s
axios.get(url)
  .then(response => {
    const products = response.data.data;

   
    const combinedProducts = [];

    products.forEach(product => {
      // Check if the product already exists by title (ignoring source_name for now)
      let existingProduct = combinedProducts.find(p => p.title === product.title);

      // If the product doesn't exist, add it as a new product
      if (!existingProduct) {
        combinedProducts.push({
          title: product.title,
          price: product.source_price,
          reviews: product.source_review,
          reviews_count: product.source_review_count,
          image: product.image,
          url: product.url,
          sources: [{
            source_name: product.source_name,
            price: product.source_price,
            reviews: product.source_review,
            reviews_count: product.source_review_count,
            source_url: product.source_url,
            source_logo: product.source_logo
          }],
          brand: product.brand,
          stock: product.stock,
          category: product.main_category,
          rating: product.source_rating,
          offers: product.offers
        });
      } else {
        // If the product exists, merge the source details
        existingProduct.sources.push({
          source_name: product.source_name,
          price: product.source_price,
          reviews: product.source_review,
          reviews_count: product.source_review_count,
          source_url: product.source_url,
          source_logo: product.source_logo
        });
        
        // Keep the product with the highest reviews
        if (product.source_review > existingProduct.reviews) {
          existingProduct.reviews = product.source_review;
          existingProduct.reviews_count = product.source_review_count;
          existingProduct.price = product.source_price;  
          existingProduct.image = product.image;  
          existingProduct.url = product.url;
        }
      }
    });

    fs.writeFileSync('combined_products.json', JSON.stringify(combinedProducts, null, 2), 'utf-8');
    console.log('Combined products saved successfully!');
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
