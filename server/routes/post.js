// ====================================================
//      Rutas API: Publicacion
//      By TutorLab Team ©
// ====================================================

const express = require('express'); 

const { verifyToken, verifyInstructorRole } = require('../middlewares/authorization.js');

const postController = require('../controllers/post');

const api = express.Router();

// =====================
// Crear nuevo Post
// =====================
api.post('/post', verifyToken , postController.savePost);


// =====================
// Crear nuevo Post
// =====================
api.put('/post-media/:id', verifyToken , postController.uploadMediaPost);

// =====================
// Obtener post por id
// =====================
api.get('/post/:id', verifyToken , postController.getPostById);

// ===============================
// Obtener publicaciones por autor
// ===============================
api.get('/posts/:author_id?', verifyToken , postController.getPosts);

// ============================================
// Obtener publicaciones por usuarios que sigo
// ============================================
api.get('/posts-all', verifyToken , postController.getPostByFollowing);

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

// =====================
// Eliminar comentario
// =====================
api.delete('/comment/:id', verifyToken , postController.deleteComment);

// ==============================
// Obtener comentarios de un post
// ==============================
api.get('/comment/:post_id', verifyToken , postController.getCommentsByPost);

module.exports = api;