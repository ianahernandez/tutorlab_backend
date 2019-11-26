// ====================================================
//      Rutas API: Sistema de seguimiento
//      By TutorLab Team ©
// ====================================================

const express = require('express'); 

const { verifyToken } = require('../middlewares/authorization.js');

const followController = require('../controllers/follow');

const followCategory = require('../controllers/followCategory');

const api = express.Router();

// ====================================================
//             SEGUIMIENTO DE USUARIOS
// ====================================================

// =====================
// Seguir usuario
// =====================
api.post('/follow', [verifyToken], followController.saveFollow);

// =======================
// Dejar de seguir usuario
// =======================
api.delete('/follow/:id', [verifyToken], followController.deleteFollow);

// =====================
// Siguiendo A
// =====================
api.get('/following/:id?', [verifyToken], followController.following);

// =====================
// Seguidores
// =====================
api.get('/follow-me/:id?', [verifyToken], followController.followMe);

// ====================================================
//             SEGUIMIENTO DE CATEGORIAS
// ====================================================

// =====================
// Seguir Categoria
// =====================
api.post('/category-follow', [verifyToken], followCategory.saveFollow);

// =======================
// Dejar de seguir Categoria
// =======================
api.delete('/category-follow/:id', [verifyToken], followCategory.deleteFollow);

// =====================
// Obtener Categorias seguidas
// =====================
api.get('/category-follow/:id?', [verifyToken], followCategory.following);


module.exports = api;