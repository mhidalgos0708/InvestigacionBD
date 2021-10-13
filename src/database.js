const mongoose = require('mongoose');

/*  Local MongoDB connection
    Replace notes-db-app with the name of your local database.*/

/*****  mongoose.connect('mongodb://localhost/notes-db-app')
        .then(db => console.log('DB is connected'))
        .catch(err => console.error(err));           ******/

/*  MongoDB Atlas connection
    Replace <dbuser> with the database user.
    Replace <password> with the password for the admin user. 
    Replace myFirstDatabase with the name of the database that connections will use by default.*/ 

/*****  mongoose.connect('mongodb+srv://<dbuser>:<password>@cluster0.8ee8w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'); *****/

/*Marianna's MongoDB Atlas connection*/
 mongoose.connect('mongodb+srv://admin:admin@cluster0.8ee8w.mongodb.net/online_clothing_store');

/* Silvia's MongoDB Atlas connection*/
//mongoose.connect('mongodb+srv://admin:admin@dbtecdigitalito.wv1yu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')