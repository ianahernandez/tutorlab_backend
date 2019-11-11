// ====================================================
//      Rutas API: Categorías
//      By TutorLab Team ©
// ====================================================

const express = require('express'); 

const { verifyToken } = require('../middlewares/authorization.js');

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
api.post('/category', categoryController.saveCategory);

// =====================
// Editar categoria
// =====================
api.put('/category/:id', categoryController.updateCategory);

// =====================
// Eliminar categoria
// =====================
api.delete('/category/:id', categoryController.deleteCategory);


module.exports = api;