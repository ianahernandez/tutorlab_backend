const express = require('express');

const { verificarToken } = require('../middlewares/authorization.js');

const Category = require('../models/category');

const app = express();

// =====================
// Todas las categorias
// =====================
app.get('/category', (req, res) => {

});
// =====================
// Una categoria por id
// =====================
app.get('/category/:id', (req, res) => {
  
});

// =====================
// Crear nueva categoria
// =====================
app.post('/category', (req, res) =>{

  let body = req.body;

  let category = new Category({
    name: body.name,
    description: body.description,
    // img: body.img,
  });

  category.save( (err, categoryDB) => {

    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      category: categoryDB
    });

  });
});

// =====================
// Editar categoria
// =====================
app.put('/category/:id', (req, res) =>{

});

// =====================
// Eliminar categoria
// =====================
app.delete('/category/:id', (req, res) =>{

});


module.exports = app;