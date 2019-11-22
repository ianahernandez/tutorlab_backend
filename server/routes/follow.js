// ====================================================
//      Rutas API: Sistema de seguimiento
//      By TutorLab Team ©
// ====================================================

const express = require('express'); 

const { verifyToken } = require('../middlewares/authorization.js');

const followController = require('../controllers/follow');

const api = express.Router();

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


module.exports = api;