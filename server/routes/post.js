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
// Guardar Like Post
// =====================
api.post('/like/:id', verifyToken , postController.saveLike);

// =====================
// Eliminar like Post
// =====================
api.delete('/like/:id', verifyToken , postController.deleteLike);

// =====================
// Comentar Post
// =====================
api.post('/comment/:post_id', verifyToken , postController.saveComment);

module.exports = api;