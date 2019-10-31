const express = require('express');

const _ = require('underscore');

const { verificarToken } = require('../middlewares/authorization.js');

const Category = require('../models/category');

const app = express();

// =====================
// Todas las categorias
// =====================
app.get('/category', (req, res) => {

  let from = req.query.from || 0;
  from = Number(from);

  let limit = req.query.limit || 5;
  limit = Number(limit);


  Category.find({ status: true })
        .skip(from)
        .limit(limit)
        .exec( (err, categoriesDB) => {

          if(err){
            return res.status(400).json({
              ok: false,
              err
            });
          }

          Category.count({ status: true }, (err, count) =>{
            res.json({
              ok: true,
              categories: categoriesDB,
              count
            });
          })

        });

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
  let id = req.params.id;

  let body = _.pick( req.body, ['name', 'description', 'img']);

  Category.findByIdAndUpdate( id, body, {new: true, runValidators: true,  context: 'query'}, (err, categoryDB) => {

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
// Eliminar categoria
// =====================
app.delete('/category/:id', (req, res) =>{

});


module.exports = app;