// ====================================================
//      Rutas API: Publicacion
//      By TutorLab Team ©
// ====================================================

const express = require('express'); 

const { verifyToken, verifyAdminRole, verifyInstructorRole } = require('../middlewares/authorization.js');

const postController = require('../controllers/post');

const api = express.Router();

// =====================
// Crear nueva categoria
// =====================
api.post('/post', verifyToken , postController.savePost);

// =====================
// Publicar Curso
// =====================
api.post('/post/:course_id', [verifyToken, verifyInstructorRole] , postController.savePostCourse);

// =====================
// Compartir Post
// =====================
api.post('/share/:post_id', verifyToken , postController.sharePost);

// =====================
// Eliminar Post
// =====================
api.delete('/post/:id', verifyToken , postController.deletePost);

// =====================
// Like Post
// =====================
api.post('/like/:id', verifyToken , postController.saveLike);

// =====================
// Delete like Post
// =====================
api.delete('/like/:id', verifyToken , postController.deleteLike);

module.exports = api;