// ====================================================
//      Rutas API: Categorías
//      By TutorLab Team ©
// ====================================================

const express = require('express'); 

const { verifyToken, verifyUserLogged, verifyInstructorRole, verifyUser } = require('../middlewares/authorization.js');

const courseController = require('../controllers/course');

const sectionController = require('../controllers/section');

const lessonController = require('../controllers/lesson');

const resourceController = require('../controllers/externalResource');

const api = express.Router();
// =====================
// Obtener todos
// =====================
api.get('/course', [ verifyUser ], courseController.getCourses);

// =====================
// Obtener Curso por Id
// =====================
api.get('/course/:id', courseController.getCourseById);

// =====================
// Obtener Seccion por Id
// =====================
api.get('/section/:id', sectionController.getSectionById);

// =====================
// Obtener Leccion por Id
// =====================
api.get('/lesson/:id', lessonController.getLessonById);

// =====================
// Crear nuevo curso
// =====================
api.post('/course', [verifyToken, verifyInstructorRole], courseController.saveCourse);

// =====================
// Agregar seccion
// =====================
api.post('/section/:course_id', sectionController.saveSection);

// =====================
// Agregar leccion (clase)
// =====================
api.post('/lesson/:section_id', lessonController.saveLesson);

// =====================
// Agregar recurso externo
// =====================
api.post('/resource/:lesson_id', resourceController.saveExternalResource);

module.exports = api;