const express = require('express');
const { getProducts, searchProducts,getSingleProduct } = require('../controllers/productController');

const router = express.Router();




router.post('/search', searchProducts);
router.get('/:id', getSingleProduct);

module.exports = router;
