const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Filter = require('../models/Filter');

router.get('/shop', async (req, res) => {
    const filters = await Filter.findOne({section: "shop"}).lean();
    const products = await Product.find({stock: {$gt: 0}}).sort({_id: 1}).lean();
    const totalNumberResults = products.length;
    res.render('shop/shop', {filters, totalNumberResults, products});
});

router.get('/shop/category/:category', async (req, res) => {
    const filter = req.params.category;
    const filters = await Filter.findOne({section: "shop"}).lean();
    const products = await Product.find({$and: [{category: filter},{stock: {$gt: 0}}]}).sort({_id: 1}).lean();
    const totalNumberResults = products.length;
    res.render('shop/shop', {filters, totalNumberResults, products});
});

router.get('/shop/brand/:brand', async (req, res) => {
    const filter = req.params.brand;
    const filters = await Filter.findOne({section: "shop"}).lean();
    const products = await Product.find({$and: [{brand: filter},{stock: {$gt: 0}}]}).sort({_id: 1}).lean();
    const totalNumberResults = products.length;
    res.render('shop/shop', {filters, totalNumberResults, products});
});

router.get('/shop/price/:price', async (req, res) => {
    const filter = req.params.price;
    const filters = await Filter.findOne({section: "shop"}).lean();
    if(filter == "$250+") {
        const limit = filter.replace(/[$+]/g,'');
        const products = await Product.find({$and: [{price: {$gte: limit}},{stock: {$gt: 0}}]}).sort({_id: 1}).lean();
        const totalNumberResults = products.length;
        res.render('shop/shop', {filters, totalNumberResults, products});
    } else {
        const limits = filter.split(' - ');
        const firstLimit = parseFloat(limits[0].replace('$',''));
        const secondLimit = parseFloat(limits[1].replace('$',''));
        const products = await Product.find({
            $and: [
                {stock: {$gt: 0}},
                { price: { $gte: firstLimit } },
                { price: { $lt: secondLimit } }
            ]
        }).sort({_id: 1}).lean();
        const totalNumberResults = products.length;
        res.render('shop/shop', {filters, totalNumberResults, products});
    }
});

router.get('/shop/tags/clothing/:clothing', async (req, res) => {
    const filter = req.params.clothing;
    const filters = await Filter.findOne({section: "shop"}).lean();
    const products = await Product.find({$and: [{tagClothing: filter},{stock: {$gt: 0}}]}).sort({_id: 1}).lean();
    const totalNumberResults = products.length;
    res.render('shop/shop', {filters, totalNumberResults, products});
});

router.get('/shop/tags/type/:type', async (req, res) => {
    const filter = req.params.type;
    const filters = await Filter.findOne({section: "shop"}).lean();
    const products = await Product.find({$and: [{tagType: filter},{stock: {$gt: 0}}]}).sort({_id: 1}).lean();
    const totalNumberResults = products.length;
    res.render('shop/shop', {filters, totalNumberResults, products});
});

router.get('/shop/colors/:color', async (req, res) => {
    const filter = req.params.color;
    const filters = await Filter.findOne({section: "shop"}).lean();
    const products = await Product.find({$and: [{color: filter},{stock: {$gt: 0}}]}).sort({_id: 1}).lean();
    const totalNumberResults = products.length;
    res.render('shop/shop', {filters, totalNumberResults, products});
});

router.get('/shop/size/:size', async (req, res) => {
    const filter = req.params.size;
    const filters = await Filter.findOne({section: "shop"}).lean();
    const products = await Product.find({$and: [{size: filter},{stock: {$gt: 0}}]}).sort({_id: 1}).lean();
    const totalNumberResults = products.length;
    res.render('shop/shop', {filters, totalNumberResults, products});
});

router.get('/shop/search', async (req, res) => {
    const { search } = req.query;
    const filters = await Filter.findOne({section: "shop"}).lean();
    const products = await Product.find({$and: [{name: {$regex: search, $options: "$i"}},
        {stock: {$gt: 0}}]}).sort({_id: 1}).lean();
    const totalNumberResults = products.length;
    res.render('shop/shop', {filters, totalNumberResults, products});
});

router.get('/shop/publishProduct', async (req, res) => {
    const filters = await Filter.find({section: "shop"}).lean();
    res.render('shop/publishProduct', {filters});
});

router.post('/shop/publishProduct', async (req, res) => {
    const {name, description, brand, code, category, tagType, tagClothing, price, stock, photo, size, color} = req.body;
    const errors = [];
    if(name=='') {
        errors.push({text: 'Please enter the product name'});
    }
    if(description=='') {
        errors.push({text: 'Please enter the description'});
    }
    if(!code=='') {
        errors.push({text: 'Please enter the product code'});
    }
    if(price==0) {
        errors.push({text: 'Please enter the price'});
    }
    if(stock==0) {
        errors.push({text: 'Please enter the stock available'});
    }
    if(errors.length > 0) {
        res.render('shop/publishProduct', {
            errors,
            name,
            description,
            code,
            price,
            stock
        });
    } else {
        const product = new Product( { name, description, brand, code, category, tagType, tagClothing,
            price, stock, photo, size, color } );
        console.log(product);
        await product.save();
        req.flash('success_msg', 'Added product!');
        res.redirect('/shop');
    }
});

module.exports = router;