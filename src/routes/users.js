const express = require('express');
const router = express.Router();

const User = require('../models/User');
const passport = require('passport');

const { isAuthenticated } = require('../helpers/auth');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const { name, dateofbirth, avatar, username, password, confirm_password } = req.body;
    const uniqueUsername = await User.findOne({username: username}).lean();
    const errors = [];
    if(name == '' || dateofbirth == '' || avatar == '' || username == '' || 
        password == '' || confirm_password == '') {
        errors.push({text: 'All are required fields'});
    }
    if(password != confirm_password) {
        errors.push({text: 'Password and confirmation do not match'});
    }
    if(password.length < 8) {
        errors.push({text: 'Password must be at least 8 characters'});
    }
    if(uniqueUsername) {
        errors.push({text: 'Username already exists. Try another one'});
    }
    if(errors.length > 0) {
        res.render('users/signup', {errors, name, dateofbirth, avatar, username, password, confirm_password});
    } else {
        const newUser = new User({username, password, name, dateofbirth, avatar});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Your account has been successfully created');
        res.redirect('/users/signin');
    }
});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/users/signin');
});

router.get('/users/profile', isAuthenticated, (req, res) => {
    res.render('users/profile');
});

router.get('/users/edit/:id', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.params.id).lean();
    res.render('users/edit-profile', {user});
});

router.put('/users/edit-profile/:id', isAuthenticated, async (req, res) => {
    var { name, dateofbirth, avatar, username, password, confirm_password } = req.body;
    const uniqueUsername = await User.findOne({username: username}).lean();
    const errors = [];
    if(name == '' || dateofbirth == '' || avatar == '' || username == '' || 
        password == '' || confirm_password == '') {
        errors.push({text: 'All are required fields'});
    }
    if(password != confirm_password) {
        errors.push({text: 'Password and confirmation do not match'});
    }
    if(password.length < 8) {
        errors.push({text: 'Password must be at least 8 characters'});
    }
    if(uniqueUsername && uniqueUsername._id != req.params.id) {
        errors.push({text: 'Username already exists. Try another one'});
    }
    if(errors.length > 0) {
        res.render('users/edit-profile', {errors, name, dateofbirth, avatar, username, password, confirm_password});
    } else {
        const userPassword = new User({password});
        password = await userPassword.encryptPassword(password);
        await User.findByIdAndUpdate(req.params.id, {name, dateofbirth, avatar, username, password});
        req.logout();
        req.flash('success_msg', 'Updated profile!');
        res.redirect('/users/signin');
    }
});

module.exports = router;