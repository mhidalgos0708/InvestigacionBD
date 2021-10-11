const express = require('express');
const router = express.Router();

const User = require('../models/User');
const passport = require('passport');
const {session,pool} = require('../database');

const { isAuthenticated } = require('../helpers/auth');

router.get('/chat/chat', isAuthenticated,(req, res) => {
    res.render('chat/chat');
});

router.get('/chat/chat/sent', isAuthenticated,(req, res) => {
    console.log(currentUser)
    res.render('chat/chat');
});

router.get('/chat/chat/:userfriend/:username', isAuthenticated, async(req, res) => {
    userFriend = req.params.userfriend;
    currentUser = req.params.username;

    const messages = [];
    pool.query("SELECT * FROM messages WHERE (Sender=? OR Sender=?) AND (Receiver=? OR Receiver=?)",[currentUser,userFriend,currentUser,userFriend], function (err, result) {
        if (err){
            console.log(err);
            res.render('chat/chat',{messages,userFriend});
        } 
        else{
            result.forEach(function(record){
                messages.push(record);
            });
            res.render('chat/chat',{messages,userFriend});
        }
      });
});

router.post('/chat/chat/sendMessage/:userFriend/:username',isAuthenticated, async (req, res) =>{
    const { newMessage } = req.body;
    currentUser = req.params.username;
    userFriend = req.params.userFriend;
    pool.query("insert into MESSAGES(Sender, Receiver, Message,timeInfo) VALUES (?, ?, ?,CONCAT(CURRENT_DATE(),' ',CURRENT_TIME()))",[currentUser,userFriend,newMessage],function (err, result) {
        if (err){
            console.log(err);
        } 
        else{
            console.log('Successfully sent');
        }
    });
    const messages = [];
    pool.query("SELECT * FROM messages WHERE (Sender=? OR Sender=?) AND (Receiver=? OR Receiver=?)",[currentUser,userFriend,currentUser,userFriend], function (err, result) {
        if (err){
            console.log(err);
            res.render('chat/chat',{messages,userFriend});
        } 
        else{
            result.forEach(function(record){
                messages.push(record);
            });
            res.render('chat/chat',{messages,userFriend});
        }
      });
});

module.exports = router;