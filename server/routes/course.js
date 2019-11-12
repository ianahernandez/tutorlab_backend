// ====================================================
//      Rutas API: Categorías
//      By TutorLab Team ©
// ====================================================

const express = require('express'); 

const { verifyToken, verifyUserLogged } = require('../middlewares/authorization.js');

const courseController = require('../controllers/course');

const api = express.Router();

// =====================
// Obtener por Id
// =====================
api.get('/course/:id', courseController.getCourseById);

// =====================
// Crear nuevo curso
// =====================
api.post('/course', courseController.saveCourse);

// =====================
// Agregar seccion
// =====================
api.post('/section/:id', courseController.saveSection);

module.exports = api;