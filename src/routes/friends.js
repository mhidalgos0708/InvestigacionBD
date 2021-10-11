const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const {session,pool} = require('../database');

const { isAuthenticated } = require('../helpers/auth');

router.get('/listFriends/seeFriends', isAuthenticated, async(req, res) => {
   res.render('listFriends/seeFriends');
});

router.get('/listFriends/seeFriends/:username', isAuthenticated, async(req, res) => {
    const usernameParam = req.params.username;
    session
        .run('MATCH (:User {username: $usernameP})-[:FIRIEND_OF]-(userFriend) RETURN userFriend',{usernameP:usernameParam})
        .then(function(result){
            var friends = [];
            result.records.forEach(function(record){
                friends.push({
                    name:record._fields[0].properties.name,
                    username:record._fields[0].properties.username
                });
            });
            res.render('listFriends/seeFriends',{friends});
        })
        .catch(function(err){
            console.log(err);
        });
});

router.post('/listFriends/seeFriends',isAuthenticated, async (req, res) =>{
    const { usernameParam } = req.body;
    const uniqueUsername = await User.findOne({username: usernameParam}).lean();
    const errors = [];
    if(uniqueUsername){
        var newUser =[];

        newUser.push({
            name:uniqueUsername.name,
            username:uniqueUsername.username
        });
        res.render('listFriends/seeFriends',);
    }
    if(!uniqueUsername){
        console.log(uniqueUsername);
        errors.push({text: 'Username does not exists. Try another one'});
        res.render('listFriends/seeFriends', {errors, usernameParam});
    }
});

router.get('/listFriends/friendCourses',isAuthenticated, async(req, res) => {
    res.render('/listFriends/friendCourses');
})

getUserCourses = (student) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT course, course_name FROM course_register where student = ?', [student], (error, courses) => {
            if(error){
                return reject(error);
            }
            return resolve(courses);
        });
    });
};

router.get('/seeCourses/:username',isAuthenticated,async(req,res) =>{
    const userFriend = req.params.username;
    try {
        const teacherCourses = await Course.find({ $and: [ {teacher: userFriend}, { state: 'public' }, { $or: [ { $and: [ { enddate: { $exists: true } }, { enddate: { $gte: new Date () } } ] }, { enddate: { $exists: false } } ] }] }).sort({date: 'desc'}).lean();
        const studentCourses = await getUserCourses(userFriend);
        console.log(studentCourses);
        res.render('listFriends/friendCourses', {teacherCourses,studentCourses});

    } catch(e) {}
});

router.post('/listFriends/seeFriends/addFriend/:currentUser',isAuthenticated,async (req, res) =>{
    const currentUser=req.params.currentUser;
    const {usernameParam}=req.body;
    const uniqueUsername = await User.findOne({username: usernameParam}).lean();
    const errors=[];
    if(!uniqueUsername){
        console.log(uniqueUsername);
        errors.push({text: 'Username does not exists. Try another one'});
        res.render('listFriends/seeFriends', {errors, usernameParam});
    }
    if(uniqueUsername.username != currentUser){
        try {
            const readQuery = 'match(n:User{username:$currentUsername})-[:FIRIEND_OF]-(a:User) return a';
            const readResult = await session.readTransaction(tx =>
                tx.run(readQuery, {currentUsername:currentUser}))
            readResult.records.forEach(record => {
                if(record._fields[0].properties.username == usernameParam)
                    {
                        console.log(usernameParam)
                        errors.push({text: 'Username is already your friend'});
                    }
            })

            if(errors.length > 0)
            {
                res.render('listFriends/seeFriends', {errors, usernameParam});
            }
            else{
                writeQuery = 'MATCH(a:User), (b:User) WHERE a.username = $currentUsername AND b.username = $newFriend CREATE (a)-[:FIRIEND_OF]->(b)';
                await session.writeTransaction(tx =>
                    tx.run(writeQuery, { currentUsername:currentUser,newFriend:usernameParam })
                  );
                res.render('listFriends/seeFriends')
            }
        }
        catch(error)
        {
            console.log(error);
        }
          finally {}
}});
module.exports = router;