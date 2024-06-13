-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS Submission;
DROP TABLE IF EXISTS Enrollment;
DROP TABLE IF EXISTS Assignment;
DROP TABLE IF EXISTS Course;
DROP TABLE IF EXISTS User;

-- Create User table
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'instructor', 'student') NOT NULL
);

-- Create Course table
CREATE TABLE Course (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    number VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    term VARCHAR(255) NOT NULL,
    instructorId INT NOT NULL,
    FOREIGN KEY (instructorId) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Assignment table
CREATE TABLE Assignment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    courseId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    points INT NOT NULL,
    due DATETIME,
    FOREIGN KEY (courseId) REFERENCES Course(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Submission table
CREATE TABLE Submission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignmentId INT NOT NULL,
    studentId INT NOT NULL,
    timestamp DATETIME NOT NULL,
    grade FLOAT,
    filename VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    contentType VARCHAR(255) NOT NULL,
    FOREIGN KEY (assignmentId) REFERENCES Assignment(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (studentId) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Enrollment table (junction table for the many-to-many relationship between User and Course)
CREATE TABLE Enrollment (
    userId INT NOT NULL,
    courseId INT NOT NULL,
    PRIMARY KEY (userId, courseId),
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (courseId) REFERENCES Course(id) ON DELETE CASCADE ON UPDATE CASCADE
);

