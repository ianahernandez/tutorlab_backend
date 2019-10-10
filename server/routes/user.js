const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const User = require('../models/user');

const { verificarToken, verificarAdminRole } = require('../middlewares/authorization');

const app = express();

//Obtener todos los usuarios activos
app.get('/users', verificarToken, function (req, res) {

  let from = req.query.from || 0;
  from = Number(from);

  let limit = req.query.limit || 5;
  limit = Number(limit);


  User.find({ status: true }) //Mostrar solo los campos indicados en el segundo parametro
        .skip(from)
        .limit(limit)
        .exec( (err, users) => {

          if(err){
            return res.status(400).json({
              ok: false,
              err
            });
          }

          User.count({ status: true }, (err, count) =>{
            res.json({
              ok: true,
              users,
              count
            });
          })

        })
});

//Obtener usuario
app.get('/user', function (req, res) {
  res.json('get user');
});


//Registrar usuario
app.post('/user', function (req, res) {

  let body = req.body;

  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    // img: body.img,
    role: body.role
  });

  user.save( (err, userDB) => {

    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      user: userDB
    });

  });

});

//Actualizar info usuario
app.put('/user/:id', verificarToken, function (req, res) {

  let id = req.params.id;

  let body = _.pick( req.body, ['name', 'email', 'img', 'role', 'status']);

  User.findByIdAndUpdate( id, body, {new: true, runValidators: true,  context: 'query'}, (err, userDB) => {

    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      user: userDB
    });

  });

});

//Borra registro lógicamente
app.delete('/user/:id', [verificarToken, verificarAdminRole],function (req, res) {

  let id = req. params.id;

  let cambiarEstado = {
    status: false
  }

  User.findByIdAndUpdate( id, cambiarEstado, {new: true, context: 'query'}, (err, userDB) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if( !userDB ){
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no encontrado"
        }
      });
    }

    res.json({
      ok: true,
      user: userDB
    });

  });

});

module.exports = app;