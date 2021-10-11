const express = require('express');
const router = express.Router();
const fs = require('fs');

const Question = require('../models/Question');
const Evaluation = require('../models/Evaluation');
const Course = require('../models/Course');
const CourseSession = require('../models/Session');
const Topic = require('../models/Topic');
const SubTopic = require('../models/SubTopic');

const {session, pool, sessionRaven} = require('../database');

const { isAuthenticated } = require('../helpers/auth');
const { NextIdentityForCommand } = require('ravendb');

///////////////////////////////////////////////////////////////////////////////Courses
router.get('/teachers/courses/:user', isAuthenticated, async (req, res) => {
    const teacher = req.params.user;
    const privatecourse = await Course.find({ $and: [ {teacher: teacher}, { state: 'private' }, { $or: [ { $and: [ { enddate: { $exists: true } }, { enddate: { $gte: new Date () } } ] }, { enddate: { $exists: false } } ] }] }).sort({date: 'desc'}).lean();
    const activecourse = await Course.find({ $and: [ {teacher: teacher}, { state: 'public' }, { $or: [ { $and: [ { enddate: { $exists: true } }, { enddate: { $gte: new Date () } } ] }, { enddate: { $exists: false } } ] }] }).sort({date: 'desc'}).lean();
    const finishedcourse = await Course.find({ $and: [ {teacher: teacher}, {enddate: { $exists: true, $lt: new Date() } } ] }).sort({date: 'desc'}).lean();
    res.render('courses/teacher/courses', {privatecourse, activecourse, finishedcourse});
});
///////////////////////////////////////////////////////////////////////////////Course
router.get('/teachers/course/:user/:code', isAuthenticated, async (req, res) => {
    const user = req.params.user;
    const currentcourse = req.params.code;
    const courseSession = await CourseSession.findOne({user: user}).lean();
    if(courseSession) {
        await CourseSession.findByIdAndUpdate(courseSession._id, {currentcourse});
    } else {
        const newSession = new CourseSession({user, currentcourse});
        await newSession.save();
    }
    const course = await Course.findOne({code: req.params.code}).lean();
    res.render('courses/teacher/course', {course});
});
///////////////////////////////////////////////////////////////////////////////Evaluation
router.get('/teachers/create-evaluation', isAuthenticated, async (req, res) => {
    const questions = await Question.find().sort({date: 'desc'}).lean();
    res.render('courses/teacher/evaluation', {questions} );
});

router.post('/teachers/add-question', async (req, res) => {
    const { statement, option1, option2, option3, option4, correctoption } = req.body;
    const errors = [];
    if(statement == '' || option1 == '' || option2 == '' || option3 == '' || 
        option4 == '' || correctoption == '') {
        errors.push({text: 'Add question form is incomplete'});
    }
    if(option1 != correctoption && option2 != correctoption && 
        option3 != correctoption && option4 != correctoption) {
        errors.push({text: 'The correct option does not match any possible option'});
    }
    if(errors.length > 0) {
        res.render('courses/teacher/evaluation', {errors, statement, option1, option2, option3, option4, correctoption});
    } else {
        const newQuestion = new Question({statement, option1, option2, option3, option4, correctoption});
        await newQuestion.save();
        res.redirect('/teachers/create-evaluation');
    }
});

router.delete('/teachers/delete-question/:id', isAuthenticated, async (req, res) => {
    await Question.findByIdAndDelete(req.params.id);
    res.redirect('/teachers/create-evaluation');
});

router.post('/teachers/save-evaluation/:user', async (req, res) => {
    const { name, startdate, enddate } = req.body;
    const uniqueEvaluation = await Evaluation.findOne({name: name}).lean();
    const questions = await Question.find().lean();
    const errors = [];
    if(name == '') {
        errors.push({text: 'Required evaluation name'});
    }
    if(enddate < startdate) {
        errors.push({text: 'End date must be greater or equal to the start date'});
    }
    if(uniqueEvaluation) {
        errors.push({text: 'Evaluation name already exists. Try another one'});
    }
    if(questions.length == 0) {
        errors.push({text: 'Create one or more questions to save the evaluation'});
    }
    if(errors.length > 0) {
        res.render('courses/teacher/evaluation', {errors, name});
    } else {
        const user = req.params.user;
        const courseSession = await CourseSession.findOne({user: user}).lean();
        const course = courseSession.currentcourse;
        const newEvaluation = new Evaluation({course, name, startdate, enddate, questions});
        await newEvaluation.save();
        questions.forEach(async question => {
            await Question.findByIdAndDelete(question._id);
        });
        req.flash('success_msg', 'Your evaluation has been successfully created');
        res.redirect('/teachers/course/'+user+'/'+course);
    }
});
///////////////////////////////////////////////////////////////////////////////New Course
router.get('/teachers/newcourse', isAuthenticated, (req, res) => {
    res.render('courses/teacher/newcourse');
});

router.post('/teachers/save-course/:user', async (req, res) => {
    var { code, name, description, startdatepicker, enddatepicker, photo } = req.body;
    const uniqueCourse = await Course.findOne({code: code}).lean();
    const startdate = new Date(startdatepicker);
    const errors = [];
    if(code == '' || name == '' || description == '' || photo == '') {
        errors.push({text: 'All are required fields'});
    }
    if(enddatepicker < startdatepicker) {
        errors.push({text: 'End date must be greater or equal to the start date'});
    }
    if(uniqueCourse) {
        errors.push({text: 'Course code already exists. Try another one'});
    }
    if(errors.length > 0) {
        res.render('courses/teacher/newcourse', {errors, code, name, description});
    } else {
        const state = "private";
        var newCourse = null;
        const teacher = req.params.user;
        if(enddatepicker) {
            const enddate = new Date(enddatepicker);
            newCourse = new Course({teacher, code, name, description, startdate, enddate, photo, state});
        } else {
            newCourse = new Course({teacher, code, name, description, startdate, photo, state});
        }
        await newCourse.save();
        req.flash('success_msg', 'Your course has been successfully created');
        res.redirect('/teachers/courses/'+teacher);
    }
});

router.get('/teachers/publish-course/:user/:code', isAuthenticated, async (req, res) => {
    const user = req.params.user;
    const code = req.params.code;
    await Course.findOneAndUpdate({code: code}, {state: 'public'});
    res.redirect('/teachers/courses/'+user);
});
///////////////////////////////////////////////////////////////////////////////new topics
router.get('/teachers/course-newTopic/:code', isAuthenticated, async (req, res) => {
    try{
        const code = req.params.code;
        const topics = await Topic.find({code: code}).lean();
        res.render('courses/teacher/newTopic', {code, topics});
    }
    catch(e) {}
});

router.post('/teachers/course-newTopic/:code', async (req, res) => {
    try {
        const code = req.params.code;
        const { title } = req.body;
        const errors = [];
        if (title == '') {
            errors.push({ title: 'Required topic title' });
        }
        if(errors.length > 0) {
            res.render('courses/teacher/newTopic', { errors, title, code });
        } else {
            const newTopic = new Topic({ title, code });
            await newTopic.save();
            res.redirect('/teachers/course-newTopic/'+code);
        }
    }
    catch(e) {}
});
///////////////////////////////////////////////////////////////////////////////topics
router.get('/teachers/topic/:code/:title', isAuthenticated, async (req, res) => {
    const code = req.params.code;
    const title = req.params.title;
    const subTopic = await SubTopic.find({title: title, code: code}).lean();
    res.render('courses/teacher/topic', { code, title, subTopic });
});

router.post('/teachers/topic/:code/:title', isAuthenticated, async (req, res) => {
    try {
        const code = req.params.code;
        const title = req.params.title;

        const { subTopictitle } = req.body;
        const errors = [];

        if (subTopictitle == '') {
            errors.push({ title: 'Required sub-topic title' });
        }
        if(errors.length > 0) {
            res.render('courses/teacher/topic', { errors, subTopictitle, code, title });
        } else {
            const subTopic = new SubTopic({ subTopictitle, code, title });
            await subTopic.save();
            res.redirect('/teachers/topic/'+code+'/'+title);
        }
    }
    catch(e) {}
});

/*router.post('/teachers/uploadFile/:code/:title', isAuthenticated, async (req,res) => {
    try {
        const code = req.params.code;
        const title = req.params.title;
        const { file } = req.body;
        const errors = [];
        if (file == '') {
            errors.push({ title: 'Required a file in order to perform upload' });
        }
        if(errors.length > 0) {
            res.render('courses/teacher/topic', { errors, code, title, file });
        } else {
            const fileCaptured = fs.createReadStream(file);

            const typeFile = file.split('.')[1];

            var document = {
                name: file,
                type: typeFile,
                path: fileCaptured.path,
                collection: 'Documents'
            };
            console.log(typeFile);
            console.log(file);
            await sessionRaven.store(document);

            //sessionRaven.advanced.attachments.store("archivosCursos", nameFile, fileCaptured, typeFile);
            await sessionRaven.saveChanges();
            res.redirect('/teachers/topic/'+code+'/'+title);
        }
    }
    catch(e) {}
});*/
///////////////////////////////////////////////////////////////////////////////subTopics
router.get('/teachers/subTopic/:code/:title/:subTitle', isAuthenticated, async (req, res) => {
    const code = req.params.code;
    const title = req.params.title;
    const subTitle = req.params.subTopictitle;
    res.render('courses/teacher/subTopic', {code, title, subTitle});
});
///////////////////////////////////////////////////////////////////////////////courseMembers
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
router.get('/teachers/course-members/:course', isAuthenticated, async (req, res) => {
    const course = req.params.course;
    try {
        const students = await getCourseMembers(course);
        res.render('courses/teacher/members', {students});
    } catch(e) {}
});

module.exports = router;