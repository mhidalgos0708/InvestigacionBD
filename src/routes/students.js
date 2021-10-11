const express = require('express');
const router = express.Router();

const Evaluation = require('../models/Evaluation');
const Result = require('../models/EvaluationResult');
const Course = require('../models/Course');
const Topic = require('../models/Topic');
const SubTopic = require('../models/SubTopic');

const { isAuthenticated } = require('../helpers/auth');

const {session,pool} = require('../database');

// MySQL queries

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

// Routes

router.get('/students/courses/:user', isAuthenticated, async (req, res) => {
    const student = req.params.user;
    try {
        const courses = await getUserCourses(student);
        res.render('courses/student/courses', {courses});
    } catch(e) {}
});

router.get('/students/course/:code', isAuthenticated, async (req, res) => {
    const course = await Course.findOne({code: req.params.code}).lean();
    res.render('courses/student/course', {course});
});
/////////////////////////////////////////////////////////////////////////////////////////////seeTopics
router.get('/students/seeTopics/:code', isAuthenticated, async (req, res) => {
    const code = req.params.code;
    const topics = await Topic.find({code: code}).lean();
    res.render('courses/student/seeTopics', {code, topics});
});
/////////////////////////////////////////////////////////////////////////////////////////////Topic
router.get('/students/topic/:code/:title', isAuthenticated, async (req, res) => {
    const code = req.params.code;
    const title = req.params.title;
    const subTopics = await SubTopic.find({title: title, code: code}).lean();
    res.render('courses/student/topic', { code, title, subTopics });
});
/////////////////////////////////////////////////////////////////////////////////////////////subTopic
router.get('/students/subTopic/:code/:title/:subTitle', isAuthenticated, async (req, res) => {
    const code = req.params.code;
    const title = req.params.title;
    const subTitle = req.params.subTopictitle;
    res.render('courses/student/subTopic', {code, title, subTitle});
});
/////////////////////////////////////////////////////////////////////////////////////////////
router.get('/students/assignments/:code', isAuthenticated, async (req, res) => {
    const assignment = await Evaluation.find({course: req.params.code}).sort({date: 'desc'}).lean();
    res.render('courses/student/assignments', {assignment} );
});

router.get('/students/evaluation/:name', isAuthenticated, async (req, res) => {
    const evaluation = await Evaluation.findOne({name: req.params.name}).sort({date: 'desc'}).lean();
    res.render('courses/student/evaluation', {evaluation});
});

router.post('/students/finish-evaluation/:name/:username/:code', async (req, res) => {
    const name = req.params.name;
    const evaluation = await Evaluation.findOne({name: name}).lean();
    const selectedOptions = req.body;
    const selectedOptionsArray = [];
    const questionsArray = evaluation.questions;
    const errors = [];
    const user = req.params.username;
    const result = await Result.findOne({name: name, user: user}).lean();
    var score = 0;
    const course = req.params.code;
    for (const option in selectedOptions) {
        selectedOptionsArray.push(`${selectedOptions[option]}`);
    }
    if(questionsArray.length != selectedOptionsArray.length) {
        errors.push({text: 'You must answer all the questions'});
    }
    if(result) {
        errors.push({text: 'You already sent the evaluation'});
    }
    if(errors.length > 0) {
        res.render('courses/student/evaluation', {errors, evaluation});
    } else {
        for(var i = 0; i < questionsArray.length; i++) {
            if(questionsArray[i].correctoption == selectedOptionsArray[i]) {
                score++;
            }
        }
        score = score+"/"+questionsArray.length;
        const newEvaluationResult = new Result({course, name, user, score});
        await newEvaluationResult.save();
        req.flash('success_msg', 'Your evaluation has been successfully sent');
        res.redirect('/students/course/'+course);
    }
});

router.get('/students/scores/:user/:code', isAuthenticated, async (req, res) => {
    const result = await Result.find({ $and: [ {user: req.params.user}, { course: req.params.code} ] }).sort({date: 'desc'}).lean();    
    res.render('courses/student/scores', {result});
});

router.get('/students/search', isAuthenticated, (req, res) => {
    res.render('courses/student/search');
});

router.get('/students/search-course/:user', isAuthenticated, async (req, res) => {
    const {teacher} = req.query;
    if(teacher != req.params.user) {
        const results = await Course.find({ $and: [ {teacher: teacher}, { state: 'public' }, { $or: [ { $and: [ { enddate: { $exists: true } }, { enddate: { $gte: new Date () } } ] }, { enddate: { $exists: false } } ] }] }).sort({date: 'desc'}).lean();
        res.render('courses/student/search', {results, teacher});
    } else {
        res.render('courses/student/search');
    }
});

// MySQL queries 

getUserCourseRegister = (course, student) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM course_register where course = ? AND student = ?', [course, student], (error, register) => {
            if(error){
                return reject(error);
            }
            return resolve(register);
        });
    });
}; 

insertUserCourseRegister = (course, course_name, student, student_name) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT course_register VALUES (?, ?, ?, ?)', [course, course_name, student, student_name], (error, register) => {
            if(error){
                return reject(error);
            }
            return resolve(register);
        });
    });
};

// Routes

router.get('/students/register/:student/:student_name/:course/:course_name', isAuthenticated, async (req, res) => {
    const student = req.params.student;
    const student_name = req.params.student_name;
    const course = req.params.course;
    const course_name = req.params.course_name;
    try {
        const result = await getUserCourseRegister(course, student);
        if(result.length == 0) {
            await insertUserCourseRegister(course, course_name, student, student_name);
            req.flash('success_msg', 'Successful registration');
            res.redirect('/students/courses/'+student);
        } else {
            req.flash('success_msg', 'You are already registered in the course');
            res.redirect('/students/courses/'+student);
        }  
    } catch(e) {}
});

// MySQL queries 

getCourseMembers = (course) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT student, student_name FROM course_register where course = ?', [course], (error, students) => {
            if(error){
                return reject(error);
            }
            return resolve(students);
        });
    });
}; 

// Routes

router.get('/students/course-members/:course', isAuthenticated, async (req, res) => {
    const course = req.params.course;
    try {
        const students = await getCourseMembers(course);
        res.render('courses/teacher/members', {students});
    } catch(e) {}
});

module.exports = router;