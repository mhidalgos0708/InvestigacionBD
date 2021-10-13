const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Filter = require('../models/Filter');

router.get('/home/shop', async (req, res) => {
    const filters = await Filter.findOne({section: "shop"}).lean();
    const products = await Product.find().sort({_id: 1}).lean();
    const totalNumberResults = products.length;
    res.render('shop/shop', {filters, totalNumberResults, products});
});

router.get('/home/shop/category/:category', async (req, res) => {
    const filter = req.params.category;
    const filters = await Filter.findOne({section: "shop"}).lean();
    const products = await Product.find({category: filter}).sort({_id: 1}).lean();
    const totalNumberResults = products.length;
    res.render('shop/shop', {filters, totalNumberResults, products});
});

router.get('/home/shop/brand/:brand', async (req, res) => {
    const filter = req.params.brand;
    const filters = await Filter.findOne({section: "shop"}).lean();
    const products = await Product.find({brand: filter}).sort({_id: 1}).lean();
    const totalNumberResults = products.length;
    res.render('shop/shop', {filters, totalNumberResults, products});
});

router.get('/home/shop/price/:price', async (req, res) => {
    const filter = req.params.price;
    const filters = await Filter.findOne({section: "shop"}).lean();
    if(filter == "$250+") {
        const limit = filter.replace(/[$+]/g,'');
        const products = await Product.find({price: {$gte: limit}}).sort({_id: 1}).lean();
        const totalNumberResults = products.length;
        res.render('shop/shop', {filters, totalNumberResults, products});
    } else {
        const limits = filter.split(' - ');
        const firstLimit = parseFloat(limits[0].replace('$',''));
        const secondLimit = parseFloat(limits[1].replace('$',''));
        const products = await Product.find({
            $and: [
                { price: { $gte: firstLimit } },
                { price: { $lt: secondLimit } }
            ]
        }).sort({_id: 1}).lean();
        const totalNumberResults = products.length;
        res.render('shop/shop', {filters, totalNumberResults, products});
    }
});

router.get('/home/shop/tags/:tag', async (req, res) => {
    const filter = req.params.tag;
    const filters = await Filter.findOne({section: "shop"}).lean();
    const products = await Product.find({tags: filter}).sort({_id: 1}).lean();
    const totalNumberResults = products.length;
    res.render('shop/shop', {filters, totalNumberResults, products});
});

router.get('/home/shop/colors/:color', async (req, res) => {
    const filter = req.params.color;
    const filters = await Filter.findOne({section: "shop"}).lean();
    const products = await Product.find({color: filter}).sort({_id: 1}).lean();
    const totalNumberResults = products.length;
    res.render('shop/shop', {filters, totalNumberResults, products});
});

router.get('/home/shop/size/:size', async (req, res) => {
    const filter = req.params.size;
    const filters = await Filter.findOne({section: "shop"}).lean();
    const products = await Product.find({size: filter}).sort({_id: 1}).lean();
    const totalNumberResults = products.length;
    res.render('shop/shop', {filters, totalNumberResults, products});
});

router.get('/home/shop/search', async (req, res) => {
    const { search } = req.query;
    const filters = await Filter.findOne({section: "shop"}).lean();
    const products = await Product.find({name: {$regex: search, $options: "$i"}}).sort({_id: 1}).lean();
    const totalNumberResults = products.length;
    res.render('shop/shop', {filters, totalNumberResults, products});
});

module.exports = router;