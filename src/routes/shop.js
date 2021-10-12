const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Filter = require('../models/Filter');

router.get('/home/shop', async (req, res) => {
    const filters = await Filter.findOne({section: "shop"}).lean();
    const numberTotalResults = await Product.find().sort({_id: 1}).count().lean();
    const products = await Product.find().limit(12).sort({_id: 1}).lean();
    res.render('shop/shop', {filters, numberTotalResults, products});
});

router.get('/home/shop/category/:category', async (req, res) => {
    const filter = req.params.category;
    const filters = await Filter.findOne({section: "shop"}).lean();
    const numberTotalResults = await Product.find({category: filter}).sort({_id: 1}).count().lean();
    const products = await Product.find({category: filter}).limit(12).sort({_id: 1}).lean();
    res.render('shop/shop', {filters, numberTotalResults, products});
});

router.get('/home/shop/brand/:brand', async (req, res) => {
    const filter = req.params.brand;
    const filters = await Filter.findOne({section: "shop"}).lean();
    const numberTotalResults = await Product.find({brand: filter}).sort({_id: 1}).count().lean();
    const products = await Product.find({brand: filter}).limit(12).sort({_id: 1}).lean();
    res.render('shop/shop', {filters, numberTotalResults, products});
});

router.get('/home/shop/price/:price', async (req, res) => {
    const filter = req.params.price;
    const filters = await Filter.findOne({section: "shop"}).lean();
    if(filter == "$250+") {
        const limit = filter.replace(/[$+]/g,'');
        const numberTotalResults = await Product.find({price: {$gte: limit}}).sort({_id: 1}).count().lean();
        const products = await Product.find({price: {$gte: limit}}).limit(12).sort({_id: 1}).lean();
        res.render('shop/shop', {filters, numberTotalResults, products});
    } else {
        const limits = filter.split(' - ');
        const firstLimit = parseFloat(limits[0].replace('$',''));
        const secondLimit = parseFloat(limits[1].replace('$',''));
        const numberTotalResults = await Product.find({
            $and: [
                { price: { $gte: firstLimit } },
                { price: { $lt: secondLimit } }
            ]
        }).sort({_id: 1}).count().lean();
        const products = await Product.find({
            $and: [
                { price: { $gte: firstLimit } },
                { price: { $lt: secondLimit } }
            ]
        }).limit(12).sort({_id: 1}).lean();
        res.render('shop/shop', {filters, numberTotalResults, products});
    }
});

router.get('/home/shop/tags/:tag', async (req, res) => {
    const filter = req.params.tag;
    const filters = await Filter.findOne({section: "shop"}).lean();
    const numberTotalResults = await Product.find({tags: filter}).sort({_id: 1}).count().lean();
    const products = await Product.find({tags: filter}).limit(12).sort({_id: 1}).lean();
    res.render('shop/shop', {filters, numberTotalResults, products});
});

module.exports = router;