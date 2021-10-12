const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/home/shop', async (req, res) => {
    const products = await Product.find().lean();
    res.render('shop/shop', {products});
});

module.exports = router;