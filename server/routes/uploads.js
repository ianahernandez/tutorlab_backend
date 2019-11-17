


const express = require('express');

const api = express.Router();

const fileUpload = require('express-fileupload');

const uploadController = require('../controllers/uploads');

const { verifyToken, verifyAdminRole, verifyInstructorRole, verifyUserLogged, verifyImgFormat, verifyVideoFormat } = require('../middlewares/authorization');

//Opciones por defecto

api.use(fileUpload());

// =================================
// Subir foto de perfil de usuario
// =================================

api.put('/upload/users/:id', [verifyToken, verifyUserLogged, verifyImgFormat], (req, res)=>{
  req.params.type = 'users';
  uploadController.uploadFile(req, res);
});

// =================================
// Subir imagen de categorías
// =================================

api.put('/upload/categories/:id', [verifyToken, verifyAdminRole, verifyImgFormat], (req, res)=>{
  req.params.type = 'categories';
  uploadController.uploadFile(req, res);
});

// =================================
// Subir video de leccion (clase)
// =================================

api.put('/upload/lessons/:id', (req, res)=>{
  req.params.type = 'lessons'; 
  uploadController.uploadFile(req, res);
});

// =================================
// Subir video promocional de Curso
// =================================

api.put('/upload/courses/video/:id', [ verifyToken, verifyInstructorRole, verifyVideoFormat ], (req, res)=>{
  req.params.type = 'courses/video'; 
  uploadController.uploadFile(req, res);
});

// =================================
// Subir imagen del Curso
// =================================

api.put('/upload/courses/img/:id', [ verifyToken, verifyInstructorRole, verifyImgFormat ], (req, res)=>{
  req.params.type = 'courses/img'; 
  uploadController.uploadFile(req, res);
});

module.exports = api;