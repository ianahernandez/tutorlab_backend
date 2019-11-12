// ====================================================
//      Rutas API: Categorías
//      By TutorLab Team ©
// ====================================================

const express = require('express'); 

const { verifyToken, verifyAdminRole } = require('../middlewares/authorization.js');

const categoryController = require('../controllers/category');

const api = express.Router();

// =====================
// Todas las categorias
// =====================
api.get('/category', categoryController.getCategories);

// =====================
// Una categoria por id
// =====================
api.get('/category/:id', categoryController.getCategoryById);

// =====================
// Crear nueva categoria
// =====================
api.post('/category', [verifyToken, verifyAdminRole],categoryController.saveCategory);

// =====================
// Editar categoria
// =====================
api.put('/category/:id', [verifyToken, verifyAdminRole], categoryController.updateCategory);

// =====================
// Eliminar categoria
// =====================
api.delete('/category/:id', [verifyToken, verifyAdminRole], categoryController.deleteCategory);


module.exports = api;