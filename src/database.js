const mongoose = require('mongoose');
const { DocumentStore } = require('ravendb');
const neo4j = require('neo4j-driver');
const mysql = require('mysql');

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

/*Connections Renzo*/
/*Mongo*/
mongoose.connect('mongodb+srv://admin:admin@cluster0.6qbpn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
/*Raven*/
const store = new DocumentStore('https://a.free.rbarra.ravendb.cloud', 'Bases2Proyecto1');
store.initialize();
const sessionRaven = store.openSession();
/*Neo4J*/
const uri = 'neo4j+s://6f19aa79.databases.neo4j.io';
const user = 'neo4j';
const password = 'Wnb6eqMqUPK5hui7OFpUZl9kHYt_BAiQckpIW4isOLM';
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();
/*MySQL*/
const mysqlUser = 'root';
const mysqlPassword = 'root';
const db = 'TEC_Digitalito';
const pool = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: mysqlUser,
    password: mysqlPassword,
    database:db
  });
pool.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


/* Silvia's MongoDB Atlas connection*/
//mongoose.connect('mongodb+srv://admin:admin@dbtecdigitalito.wv1yu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

/* Neo4j Aura connection */
/*Silvia's Neo4j Connection */
/*const uri = 'neo4j+s://5ae41b15.databases.neo4j.io';
const user = 'neo4j';
const password = '8S7SQ1J761297EG5PBA_-v9PZ87HGGzHo2EW-Ol4Lxk';

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
const session = driver.session()*/

/* MySQL connection */
/*Silvia's MySQL Connection */

/*const mysqlUser = 'root';
const mysqlPassword = 'Silmeli11';
const db = 'TEC_Digitalito';

const pool = mysql.createConnection({
    host: "localhost",
    user: mysqlUser,
    password: mysqlPassword,
    database:db
  });

pool.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

});*/

/* Marianna's MySQL connection */
/*
const pool = mysql.createPool({
    connectionLimit: 10,    
    password: "admin",
    user: "root",
    database: "TEC_Digitalito",
    host: "localhost",
    port: "3306"
}); */

/*Marianna's MongoDB Atlas connection*/
//mongoose.connect('mongodb+srv://admin:admin@cluster0.8ee8w.mongodb.net/tecdigitalito_mongodb');
module.exports = {session, pool, sessionRaven};
//module.exports = pool;