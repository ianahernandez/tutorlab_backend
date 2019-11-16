// ====================================================
//      Rutas API: Instructor
//      By TutorLab Team ©
// ====================================================

const express = require('express'); 

const { verifyToken, verifyInstructorRole} = require('../middlewares/authorization.js');

const courseController = require('../controllers/course');

const instructorController = require('../controllers/instructor');

const api = express.Router();
// =====================
// Obtener todos
// =====================
api.get('/instructor/courses', [ verifyToken, verifyInstructorRole ], instructorController.getInstructorCourses);

module.exports = api;