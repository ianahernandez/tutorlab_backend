// ====================================================
//      Rutas API: Usuario
//      By TutorLab Team ©
// ====================================================

const express = require('express');

const userController = require('../controllers/user');

const { verifyToken, verifyAdminRole, verifyUserLogged, verifyTokenResetPassword } = require('../middlewares/authorization');

const api = express.Router();

//Obtener todos los usuarios activos
api.get('/users', verifyToken, userController.getUsers);

//Obtener usuario
api.get('/user', function (req, res) {

  res.json('get user');

});

//Registrar usuario
api.post('/user', userController.saveUser);

//Actualizar info usuario
api.put('/user/:id', [verifyToken, verifyUserLogged], userController.updateUser);

//============    Recuperar contraseña
// Envío de instrucciones por correo
api.post('/user/forgot-password', userController.forgotPassword);

// Verificacion de URL: token de cambio de contraseña
api.post('/user/auth-reset', verifyTokenResetPassword, userController.authReset);

// Cambiar contraseña
api.post('/user/reset', verifyToken, userController.passwordReset);

// ============

//Borra registro lógicamente
api.delete('/user/:id', [verifyToken, verifyAdminRole], userController.deleteUser);


module.exports = api;