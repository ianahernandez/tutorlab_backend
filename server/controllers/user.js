// ====================================================
//      Controlador: Usuario
//      By TutorLab Team ©
// ====================================================

const bcrypt = require('bcrypt');

const _ = require('underscore');

const User = require('../models/user');

const instructorController = require('./instructor');

const studentController = require('./student');

// =====================
// Guardar Usuario
// =====================

let saveUser = (req, res) => {
  let body = req.body;

  let data; 

  let user = new User({
    name: body.name,
    email: body.email,
    username: body.username,
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

    if(user.role == 'STUDENT_ROLE'){
      data = studentController.saveStudent(userDB, res);
    }

    else if(user.role == 'INSTRUCTOR_ROLE'){
      data = instructorController.saveInstructor(userDB, res);
    }

    res.json({
      ok: true,
      user: userDB,
      data
    });

  });
}

// =====================
// Obtener todos los usuarios
// =====================

let getUsers = (req, res) => {

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

        User.countDocuments({ status: true }, (err, count) =>{
          res.json({
            ok: true,
            users,
            count
          });
        })

      });
}

// =====================
// Actualizar un usuario
// =====================

let updateUser = (req, res) => {

  let id = req.params.id;

  let body = _.pick( req.body, ['name', 'username', 'email', 'img', 'role', 'status']);

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

}

// =====================
// Eliminar un usuario
// =====================

let deleteUser = (req, res) => {
  
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

}

module.exports = { 
  saveUser, 
  getUsers, 
  updateUser,
  deleteUser
}