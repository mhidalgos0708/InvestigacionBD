CREATE DATABASE TEC_Digitalito;
USE TEC_Digitalito;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';

CREATE TABLE course_register (course VARCHAR(30), course_name VARCHAR(60), student VARCHAR(30), student_name VARCHAR(60), PRIMARY KEY(course, student));

CREATE TABLE MESSAGES (
    ID_MSG INT(9) PRIMARY KEY auto_increment,
    Sender VARCHAR(25) NOT NULL,
    Receiver VARCHAR(25) NOT NULL,
    Message VARCHAR(25) NOT NULL,
    timeInfo VARCHAR(50) NOT NULL 
);


SELECT * FROM course_register;

DROP TABLE course_register;