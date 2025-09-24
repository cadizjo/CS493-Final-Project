# 📚 Tarpaulin API  
_A lightweight course management API inspired by Canvas_

![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green?logo=node.js)
![REST](https://img.shields.io/badge/API-RESTful-orange?logo=swagger)

---

## 🚀 Overview

**Tarpaulin** is a fully functional **RESTful API** for a course management system — designed as a **capstone project for CS 493**.  
It allows instructors and students to interact with courses, assignments, and submissions in a secure, scalable, and containerized environment.

Think of it as a **lightweight Canvas alternative** with modern API practices, including authentication, authorization, file handling, pagination, and rate limiting.

> You can load the file: `openapi.yaml` into the [Swagger Editor](https://editor.swagger.io)  
> to see automatically-generated documentation for all the API endpoints.

---

## ✨ Features

- 👩‍🏫 **Role-based User Management**: Admin, Instructor, and Student roles with fine-grained permissions  
- 📖 **Course Management**: Create, view, and manage courses, including enrollments  
- 📝 **Assignments & Submissions**: Instructors create assignments; students submit files with automatic timestamp tracking  
- 📂 **File Uploads/Downloads**: Submission files are stored and served via generated URLs  
- 📊 **CSV Export**: Instructors can download course rosters in CSV format  
- 🔐 **Authentication**: JWT-based login and protected routes  
- ⚡ **Rate Limiting**: Prevents abuse (10 req/min unauthenticated, 30 req/min authenticated)  
- 🐳 **Dockerized Deployment**: API and services run seamlessly in containers  
- 📑 **Pagination**: Efficiently fetch courses and submissions  

---

## 🛠️ Tech Stack

- **Backend**: Node.js / Express (REST API)  
- **Database**: PostgreSQL (or MongoDB/MySQL depending on implementation)  
- **Authentication**: JWT (JSON Web Tokens)  
- **Containerization**: Docker + Docker Compose  
- **Documentation**: OpenAPI 3.0 (Swagger)  
- **Testing**: Postman / Insomnia collections  

---

## 📂 Entities

- **Users** – Admin, Instructor, Student  
- **Courses** – Course metadata + relationships (instructors, students, assignments)  
- **Assignments** – Linked to a course, with due dates and submission rules  
- **Submissions** – Student uploads with timestamp, file storage, and grading  

---

## 🔑 Authentication & Authorization

- **JWT-based authentication** required for most endpoints  
- Users can only access their **own profile**  
- **Admin/Instructor** permissions unlock additional management endpoints  

---

## 📡 Example Endpoints

```http
# Get all courses (paginated)
GET /courses?page=1&pageSize=10

# Create a new course (Instructor/Admin only)
POST /courses
Authorization: Bearer <token>
Body: {
  "subject": "CS",
  "number": "493",
  "title": "Web Development",
  "instructorId": 123
}

# Submit an assignment (Student only)
POST /assignments/45/submissions
Authorization: Bearer <token>
Content-Type: multipart/form-data
Body: {
  "file": <upload>
}
