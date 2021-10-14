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
    res.render('shoppingCart/shopping-cart',{products,total,clientid});
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
    var validStock = true;
    if(!repetido){
        const product = await Product.findOne({code: code}).lean();
        if(product.stock < 1)
        {
            validStock = false;
        }
        var quantity = 1;
        const name = product.name;
        const price = product.price;
        const total = product.price * quantity;
        const newProductCart = new ProductShoppingCart({code, name, price, quantity, total});
        if(validStock){
            products.push(newProductCart);
            quantity = shoppingcart.total + total;

            await ShoppingCart.updateOne({ clientid: clientid }, {
                $set: {
                    products: products,
                    total: quantity
                }});
        }
        
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

router.get('/home/shop/increase-quantity/:code', async (req,res) => {
    const code = req.params.code;
    const clientid = "118240738";

    const uniqueshoppingcart = await ShoppingCart.findOne({id:clientid}).lean();
    const products = uniqueshoppingcart.products;
    const totalShop = uniqueshoppingcart.total;
    var productTotal;
    var productPrice;
    var productQuantity;
    var productStock;
    var valid = false;

    for (var i = 0; i < products.length; i++) {
        if (products[i].code == code) {
            productQuantity = products[i].quantity;
            const product = await Product.findOne({code:code}).lean();
            if(product.stock >= productQuantity + 1)
            {
                valid = true;
            }
            products[i].quantity = productQuantity +1;
            productPrice = products[i].price;
            productTotal = products[i].total;
            products[i].total = productTotal + productPrice;
            break;
        }
    }
    
    const newTotalShop = totalShop + productPrice;
    if(valid)
    {
        await ShoppingCart.updateOne({ clientid: clientid }, {
            $set: {
                products: products,
                total: newTotalShop
            }});
    }
    res.redirect('/home/shop/shopping-cart');

});

router.get('/home/shop/decrease-quantity/:code', async (req,res) => {
    const code = req.params.code;
    const clientid = "118240738";

    const uniqueshoppingcart = await ShoppingCart.findOne({id:clientid}).lean();
    const products = uniqueshoppingcart.products;
    const totalShop = uniqueshoppingcart.total;
    var productTotal;
    var productPrice;
    var productQuantity;
    var valid = false;

    for (var i = 0; i < products.length; i++) {
        if (products[i].code == code) {
            productQuantity = products[i].quantity;
            if(productQuantity > 1){
                products[i].quantity = productQuantity -1;
                productPrice = products[i].price;
                productTotal = products[i].total;
                products[i].total = productTotal - productPrice;
                valid = true;
                break;
            }
            else{
                break;
            }
            
        }
    }
    if(valid)
    {
        const newTotalShop = totalShop - productPrice;
        await ShoppingCart.updateOne({ clientid: clientid }, {
            $set: {
                products: products,
                total: newTotalShop
            }});
    }
    res.redirect('/home/shop/shopping-cart');
});

router.get('/home/shop/checkout/:clientcode', async (req,res) => {
    clientcode = req.params.clientcode;
    const uniqueshoppingcart = await ShoppingCart.findOne({id:clientcode}).lean();
    const products = uniqueshoppingcart.products;
    for (var i = 0; i < products.length; i++) {
        const productCode = products[i].code;
        console.log(productCode);
        const product = await Product.findOne({code:productCode}).lean();
        var productStock = product.stock;
        var productQuantityCart = products[i].quantity;
        productNewStock = productStock - productQuantityCart;
        await Product.updateOne({ code: productCode}, {
            $set: {
                stock: productNewStock
            }});
        console.log(productNewStock);
    }
    const newTotal = 0;
    const newProducts = [];
    await ShoppingCart.updateOne({ clientid: clientcode }, {
        $set: {
            products: newProducts,
            total: newTotal
        }});

    res.redirect('/shop');
});
module.exports = router;