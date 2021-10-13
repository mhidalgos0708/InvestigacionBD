const express = require('express');
const router = express.Router();

const ShoppingCart = require('../models/ShoppingCart');
const Product = require('../models/Product');
const ProductShoppingCart = require('../models/Product-ShoppingCart');
const passport = require('passport');


router.get('/home/shop/shopping-cart', async (req, res) => {
    const clientid = "118240738";
    const uniqueshoppingcart = await ShoppingCart.findOne({id:clientid}).lean();
    const total = uniqueshoppingcart.total;
    const products = uniqueshoppingcart.products;
    res.render('shoppingCart/shopping-cart',{products,total});
});

router.get('/home/shop/add-to-chart/:code', async (req,res) => {
    const code = req.params.code;
    const clientid = "118240738";
    const uniqueshoppingcart = await ShoppingCart.findOne({id:clientid}).lean();
    if(!uniqueshoppingcart)
    {
        const products = [];
        const total = 0.0;
        const clientid = 118240738;
        const clientname = "Silvia Rodríguez";
        const newShoppingCart = new ShoppingCart({clientid,clientname,products, total});
        await newShoppingCart.save();
    }   
    var repetido = false;
    const shoppingcart = await ShoppingCart.findOne({clientid:clientid}).lean();
    const products = shoppingcart.products;
    products.forEach(element =>{
        if(element.code == code){
            console.log("repetido");
            repetido = true;
        }
    });
    if(!repetido){
        const product = await Product.findOne({code: code}).lean();
    
        var quantity = 1;
        const name = product.name;
        const price = product.price;
        const total = product.price * quantity;
        const newProductCart = new ProductShoppingCart({code, name, price, quantity, total});

        products.push(newProductCart);
        quantity = shoppingcart.total + total;

        await ShoppingCart.updateOne({ clientid: clientid }, {
            $set: {
                products: products,
                total: quantity
            }});
    }    
    res.redirect('/home/shop/shopping-cart');
});


router.get('/home/shop/remove-from-chart/:code', async (req,res) => {
    const code = req.params.code;
    const clientid = "118240738";

    const uniqueshoppingcart = await ShoppingCart.findOne({id:clientid}).lean();
    const products = uniqueshoppingcart.products;
    const currentTotal = uniqueshoppingcart.total;
    var productTotal = 0.0;
    for (var i = 0; i < products.length; i++) {
        if (products[i].code == code) {
            productTotal = products[i].total;
            products.splice(i, 1);
            console.log(productTotal);
            break;
        }
    }
    const newTotal = currentTotal - productTotal;
    await ShoppingCart.updateOne({ clientid: clientid }, {
        $set: {
            products: products,
            total: newTotal
        }});

    res.redirect('/home/shop/shopping-cart');
});
module.exports = router;