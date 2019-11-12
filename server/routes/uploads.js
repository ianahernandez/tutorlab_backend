


const express = require('express');

const api = express.Router();

const fileUpload = require('express-fileupload');

const uploadController = require('../controllers/uploads');

const { verifyToken, verifyAdminRole, verifyUserLogged } = require('../middlewares/authorization');

//Opciones por defecto

api.use(fileUpload());

// =================================
// Subir foto de perfil de usuario
// =================================

api.put('/upload/users/:id', [verifyToken, verifyUserLogged], (req, res)=>{
  req.params.type = 'users';
  uploadController.uploadFile(req, res);
});

// =================================
// Subir imagen de categorías
// =================================

api.put('/upload/categories/:id', [verifyToken, verifyAdminRole], (req, res)=>{
  req.params.type = 'categories';
  uploadController.uploadFile(req, res);
});

module.exports = api;