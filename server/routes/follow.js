// ====================================================
//      Rutas API: Sistema de seguimiento
//      By TutorLab Team ©
// ====================================================

const express = require('express'); 

const { verifyToken, verifyAdminRole } = require('../middlewares/authorization.js');

const followController = require('../controllers/follow');

const api = express.Router();

api.post('/follow', [verifyToken], followController.saveFollow);

api.delete('/follow/:id', [verifyToken], followController.deleteFollow);

api.get('/following/:id?', [verifyToken], followController.following);

api.get('/followed/:id?', [verifyToken], followController.followed);


module.exports = api;