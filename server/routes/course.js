// ====================================================
//      Rutas API: Categorías
//      By TutorLab Team ©
// ====================================================

const express = require('express'); 

const { verifyToken, verifyUserLogged, verifyInstructorRole, verifyUser, verifyAdminRole } = require('../middlewares/authorization.js');

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
// Crear nuevo curso
// =====================
api.post('/course', [verifyToken, verifyInstructorRole], courseController.saveCourse);

// =====================
// Actualizar curso
// =====================
api.put('/course/:id', [verifyToken, verifyInstructorRole], courseController.updateCourse);

// =======================================
// Enviar curso a revisión
// =======================================
api.put('/course/:id/send-review', [ verifyToken, verifyInstructorRole ], courseController.sendCourseToReview);

// =======================================
// Publicar o despublicar curso
// =======================================
api.put('/course/:id/publish', [ verifyToken, verifyInstructorRole ], courseController.publishOrHideCourse);

// =======================================
// Aprobar o rechazar Curso
// =======================================
api.put('/course/:id/status', [ verifyToken, verifyAdminRole ], courseController.approveOrRefuseCourse);

// =====================
// Obtener Seccion por Id
// =====================
api.get('/section/:id', sectionController.getSectionById);

// =====================
// Obtener Leccion por Id
// =====================
api.get('/lesson/:id', lessonController.getLessonById);

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